import type { Page } from '@playwright/test'
import type { Order, WhaleTestConfig } from '../../types'
import { createMockOrder } from '../../factories/order'
import { resolveGatewayGlob, json } from '../utils'

export async function mockCheckoutRoute(page: Page, config: WhaleTestConfig, order?: Order) {
  const GW = resolveGatewayGlob(config)
  const response = order ?? createMockOrder()

  await page.route(`${GW}/checkout`, (route) => {
    return route.fulfill(json(response))
  })
}
