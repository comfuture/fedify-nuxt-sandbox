import type { H3Event } from 'h3'

/**
 * Constructs a Web API Request object from an H3Event instance.
 * 
 * This function creates a standard Request object, which is part of the Web API,
 * using the properties from an H3Event object from a Nuxt/H3 server context.
 * 
 * @param event - The H3Event object containing information about the current HTTP request
 * @returns A standard Web API Request object that represents the same HTTP request
 * 
 * @example
 * const event = getEvent() // From H3/Nuxt context
 * const request = requestFromEvent(event)
 * // Now you can use this request with standard fetch API consumers
 */
export function requestFromEvent(event: H3Event): Request {
  const { req } = event.node
  const url = `http://${req.headers.host}${req.url}`
  const method = req.method || 'GET'
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(',') : value)
    }
  }
  const requestInit: RequestInit = { method, headers }
  if (method !== 'GET' && method !== 'HEAD') {
    requestInit.body = req as any // Node.js ReadableStream
  }
  return new Request(url, requestInit)
}
