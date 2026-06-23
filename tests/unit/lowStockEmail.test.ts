import type { LowStockItem } from '~~/types/lowStockEmailTypes'
import { describe, expect, it } from 'vitest'
import { sendLowStockEmails } from '~~/server/utils/lowStockEmail'

const lowStockItem: LowStockItem = {
  user_id: 'user-1',
  name: 'Tuna can',
  quantity: 1,
  min_quantity: 2,
}

describe('sendLowStockEmails', () => {
  it('does not require email config when there are no low-stock items', async () => {
    await expect(sendLowStockEmails([], '', '')).resolves.toEqual({
      sentCount: 0,
      skippedCount: 0,
    })
  })

  it('rejects missing Resend configuration when an email must be sent', async () => {
    await expect(sendLowStockEmails([lowStockItem], '', '')).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Missing Resend email config',
    })
  })
})
