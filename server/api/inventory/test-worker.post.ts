export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const workerUrl = config.inventoryCronWorkerUrl

  if (!workerUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing INVENTORY_CRON_WORKER_URL',
    })
  }

  const response = await fetch(`${workerUrl.replace(/\/+$/, '')}/run`, {
    method: 'POST',
  })
  const responseText = await response.text()
  const body = parseWorkerResponse(responseText)

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: typeof body === 'string' ? body : JSON.stringify(body),
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
