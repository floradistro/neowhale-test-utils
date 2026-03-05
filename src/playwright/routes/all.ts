import type { Page } from '@playwright/test'
import type { WhaleTestConfig } from '../../types'
import { mockAnalyticsRoutes } from './analytics'
import { mockCartRoutes, type CartControl, type MockCartOpts } from './cart'
import { mockAuthRoutes, type MockAuthOpts } from './auth'
import { mockCustomerRoutes, type MockCustomerOpts } from './customer'
import { mockCheckoutRoute } from './checkout'
import { mockProductRoutes, type MockProductOpts } from './products'
import { mockAcceptJs } from './accept-js'
import { blockImages } from '../helpers/images'

export interface MockAllOpts {
  cart?: MockCartOpts
  auth?: MockAuthOpts
  customer?: MockCustomerOpts
  products?: MockProductOpts
  /** Skip blocking images. Defaults to false. */
  skipImageBlock?: boolean
  /** Skip Accept.js mock. Defaults to false. */
  skipAcceptJs?: boolean
}

/** Mock all gateway routes at once. Returns CartControl for cart state manipulation. */
export async function mockAllRoutes(
  page: Page,
  config: WhaleTestConfig,
  opts?: MockAllOpts,
): Promise<CartControl> {
  await mockAnalyticsRoutes(page, config)
  const control = await mockCartRoutes(page, config, opts?.cart)
  await mockAuthRoutes(page, config, opts?.auth)
  await mockCustomerRoutes(page, config, opts?.customer)
  await mockCheckoutRoute(page, config)
  if (!opts?.skipAcceptJs) await mockAcceptJs(page)
  await mockProductRoutes(page, config, opts?.products)
  if (!opts?.skipImageBlock) await blockImages(page)
  return control
}
