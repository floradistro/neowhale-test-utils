import type { Page } from '@playwright/test'
import type { Customer, WhaleTestConfig } from '../../types'
import { createMockCustomer } from '../../factories/customer'
import { createMockSendCodeResponse, createMockVerifyResponse } from '../../factories/auth'
import { resolveGatewayGlob, json } from '../utils'

export interface MockAuthOpts {
  /** Customer returned on verify. Defaults to createMockCustomer(). */
  customer?: Customer
}

export async function mockAuthRoutes(page: Page, config: WhaleTestConfig, opts?: MockAuthOpts) {
  const GW = resolveGatewayGlob(config)
  const customer = opts?.customer ?? createMockCustomer()

  // POST /storefront/auth/send-code
  await page.route(`${GW}/storefront/auth/send-code`, (route) => {
    return route.fulfill(json(createMockSendCodeResponse()))
  })

  // POST /storefront/auth/verify-code
  await page.route(`${GW}/storefront/auth/verify-code`, (route) => {
    return route.fulfill(json(createMockVerifyResponse({}, customer)))
  })
}
