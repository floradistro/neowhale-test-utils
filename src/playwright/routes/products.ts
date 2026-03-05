import type { Page } from '@playwright/test'
import type { Product, WhaleTestConfig } from '../../types'
import { createMockProduct } from '../../factories/product'
import { resolveGatewayGlob, json } from '../utils'

export interface MockProductOpts {
  /** Products for list endpoint. Defaults to two generic products. */
  products?: Product[]
  /** Single product for detail endpoint. Defaults to first product in list. */
  singleProduct?: Product
}

export async function mockProductRoutes(page: Page, config: WhaleTestConfig, opts?: MockProductOpts) {
  const GW = resolveGatewayGlob(config)
  const products = opts?.products ?? [createMockProduct(), createMockProduct()]
  const singleProduct = opts?.singleProduct ?? products[0]

  await page.route(`${GW}/products`, (route) => {
    return route.fulfill(json({ data: products, total: products.length }))
  })

  await page.route(`${GW}/products/*`, (route) => {
    return route.fulfill(json(singleProduct))
  })
}
