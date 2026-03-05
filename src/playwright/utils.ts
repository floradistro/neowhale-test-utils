import type { WhaleTestConfig } from '../types'

/** 1x1 transparent PNG as a base64 Buffer — use for image mocking */
export const TRANSPARENT_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

/** Build the glob pattern for gateway API routes */
export function resolveGatewayGlob(config: WhaleTestConfig): string {
  const proxyPath = config.proxyPath ?? '/api/gw'
  return `**${proxyPath}/v1/stores/${config.storeId}`
}

/** Shorthand for Playwright route.fulfill with JSON */
export function json(data: unknown, status = 200) {
  return {
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  }
}
