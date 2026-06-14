export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const workerUrl = config.inventoryCronWorkerUrl
  const cronSecret = config.inventoryCronSecret

  if (!workerUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing INVENTORY_CRON_WORKER_URL',
    })
  }

  if (!cronSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing INVENTORY_CRON_SECRET',
    })
  }

  const response = await fetch(`${workerUrl.replace(/\/+$/, '')}/run`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${cronSecret}`,
      'x-cron-secret': cronSecret,
    },
  })
  const responseText = await response.text()
  const body = parseWorkerResponse(responseText)

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: getWorkerErrorMessage(body, response.status),
    })
  }

  return body
})

function parseWorkerResponse(responseText: string): unknown {
  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText)
  }
  catch {
    return responseText
  }
}

function getWorkerErrorMessage(body: unknown, status: number) {
  if (typeof body !== 'string') {
    return stringifyWorkerError(body)
  }

  const titleMatch = body.match(/<title>([^<]+)<\/title>/i)
  const headingMatch = body.match(/<h2[^>]*>([^<]+)<\/h2>/i)
  const message = titleMatch?.[1] ?? headingMatch?.[1]

  if (message !== undefined) {
    return `Worker request failed: ${message.trim()}`
  }

  return body.length > 240
    ? `Worker request failed with status ${status}`
    : body
}

function stringifyWorkerError(body: unknown) {
  if (body === null || body === undefined) {
    return 'Worker request failed'
  }

  if (typeof body === 'object' && 'message' in body) {
    const message = body.message

    if (typeof message === 'string' && message.length > 0) {
      return message
    }
  }

  return JSON.stringify(body)
}
