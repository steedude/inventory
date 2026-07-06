import process from 'node:process'
import * as Sentry from '@sentry/nuxt'

const sentryDsn = process.env.SENTRY_DSN ?? ''
const sentryEnabled = process.env.NUXT_PUBLIC_SENTRY_ENABLED === 'true'

if (sentryEnabled && sentryDsn.length > 0) {
  Sentry.init({
    dsn: sentryDsn,
  })
}
