import type { LowStockItem, NotificationSettingRow } from '~~/types/lowStockEmailTypes'
import { Resend } from 'resend'
import { AppErrorCode } from '~~/config/errorConfig'
import { lowStockEmailCopy, lowStockEmailStyles } from '~~/config/lowStockEmailConfig'
import { createAppServerError } from '~~/server/utils/appServerError'

interface SendLowStockEmailOptions {
  respectDailyEmailSettings?: boolean
}

export async function sendLowStockEmails(
  items: LowStockItem[],
  apiKey: string,
  fromEmail: string,
  options: SendLowStockEmailOptions = {},
) {
  if (items.length === 0) {
    return {
      sentCount: 0,
      skippedCount: 0,
    }
  }

  if (!apiKey || !fromEmail) {
    throw createAppServerError(500, AppErrorCode.MissingResendConfig)
  }

  const resend = new Resend(apiKey)
  const supabase = useSupabaseServiceClient()
  const itemsByUserId = groupItemsByUserId(items)
  const notificationSettings = options.respectDailyEmailSettings === true
    ? await fetchNotificationSettings(Array.from(itemsByUserId.keys()))
    : new Map<string, boolean>()
  let sentCount = 0
  let skippedCount = 0

  for (const [userId, userItems] of itemsByUserId.entries()) {
    if (options.respectDailyEmailSettings === true && notificationSettings.get(userId) === false) {
      skippedCount += 1
      continue
    }

    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error !== null) {
      throw createAppServerError(500, AppErrorCode.EmailSendFailed)
    }

    const email = data.user?.email

    if (email === undefined || email.length === 0) {
      skippedCount += 1
      continue
    }

    const { error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `${lowStockEmailCopy.subjectPrefix}: ${userItems.length} item${userItems.length > 1 ? 's' : ''}`,
      html: createLowStockEmailHtml(userItems),
      text: createLowStockEmailText(userItems),
    })

    if (emailError !== null) {
      throw createAppServerError(502, AppErrorCode.EmailSendFailed)
    }

    sentCount += 1
  }

  return {
    sentCount,
    skippedCount,
  }
}

async function fetchNotificationSettings(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, boolean>()
  }

  const supabase = useSupabaseServiceClient()
  const { data, error } = await supabase
    .from('user_settings')
    .select('user_id, low_stock_daily_email_enabled')
    .in('user_id', userIds)
    .overrideTypes<NotificationSettingRow[], { merge: false }>()

  if (error !== null) {
    throw createAppServerError(500, AppErrorCode.UserSettingsFetchFailed)
  }

  return (data ?? []).reduce((settings, setting) => {
    settings.set(setting.user_id, setting.low_stock_daily_email_enabled)
    return settings
  }, new Map<string, boolean>())
}

function groupItemsByUserId(items: LowStockItem[]) {
  return items.reduce((groups, item) => {
    const group = groups.get(item.user_id) ?? []

    group.push(item)
    groups.set(item.user_id, group)

    return groups
  }, new Map<string, LowStockItem[]>())
}

function createLowStockEmailHtml(items: LowStockItem[]) {
  const itemRows = items.map(item => `
    <tr>
      <td style="${lowStockEmailStyles.cell}">${escapeHtml(item.name)}</td>
      <td style="${lowStockEmailStyles.cellRight}">${item.quantity}</td>
      <td style="${lowStockEmailStyles.cellRight}">${item.min_quantity}</td>
    </tr>
  `).join('')

  return `
    <div style="${lowStockEmailStyles.container}">
      <h1 style="${lowStockEmailStyles.title}">${lowStockEmailCopy.title}</h1>
      <p style="${lowStockEmailStyles.description}">
        ${items.length} inventory item${items.length > 1 ? 's are' : ' is'} at or below the minimum quantity.
      </p>
      <table style="${lowStockEmailStyles.table}">
        <thead>
          <tr>
            <th style="${lowStockEmailStyles.headerCell}">${lowStockEmailCopy.itemHeader}</th>
            <th style="${lowStockEmailStyles.headerCellRight}">${lowStockEmailCopy.currentHeader}</th>
            <th style="${lowStockEmailStyles.headerCellRight}">${lowStockEmailCopy.minimumHeader}</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    </div>
  `
}

function createLowStockEmailText(items: LowStockItem[]) {
  const itemLines = items.map((item) => {
    return `- ${item.name}: current ${item.quantity}, minimum ${item.min_quantity}`
  }).join('\n')

  return `${lowStockEmailCopy.title}\n\n${items.length} inventory item${items.length > 1 ? 's are' : ' is'} at or below the minimum quantity.\n\n${itemLines}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}
