import type { Page } from '@playwright/test'
import type { WhaleTestConfig } from '../../types'
import { createMockSession } from '../../factories/session'
import { resolveGatewayGlob, json } from '../utils'

export async function mockAnalyticsRoutes(page: Page, config: WhaleTestConfig) {
  const GW = resolveGatewayGlob(config)

  // Storefront sessions (telemetry init)
  await page.route(`${GW}/storefront/sessions`, (route) =>
    route.fulfill(json(createMockSession(config.storeId)))
  )
  await page.route(`${GW}/storefront/sessions/*`, (route) =>
    route.fulfill(json({ ok: true }))
  )
  // Storefront events
  await page.route(`${GW}/storefront/events`, (route) =>
    route.fulfill(json({ ok: true }))
  )
  await page.route(`${GW}/storefront/events/*`, (route) =>
    route.fulfill(json({ ok: true }))
  )
}
