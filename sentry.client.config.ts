import * as Sentry from '@sentry/nuxt'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const sentryDsn = config.public.sentryDsn
const sentryEnabled = config.public.sentryEnabled === true

if (sentryEnabled && sentryDsn.length > 0) {
  Sentry.init({
    dsn: sentryDsn,
  })
}
