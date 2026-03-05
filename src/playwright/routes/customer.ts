import type { Page } from '@playwright/test'
import type { Customer, Order, CustomerAnalytics, WhaleTestConfig } from '../../types'
import { createMockCustomer } from '../../factories/customer'
import { createMockAnalytics } from '../../factories/analytics'
import { resolveGatewayGlob, json } from '../utils'

export interface MockCustomerOpts {
  /** Customer data. Defaults to createMockCustomer(). */
  customer?: Customer
  /** Analytics data. Defaults to createMockAnalytics(). */
  analytics?: CustomerAnalytics
  /** Orders to return. Defaults to empty array. */
  orders?: Order[]
}

export async function mockCustomerRoutes(page: Page, config: WhaleTestConfig, opts?: MockCustomerOpts) {
  const GW = resolveGatewayGlob(config)
  const customer = opts?.customer ?? createMockCustomer()
  const analytics = opts?.analytics ?? createMockAnalytics({ customer_id: customer.id })
  const orders = opts?.orders ?? []

  // GET /customers/:id
  await page.route(`${GW}/customers/*`, (route) => {
    const url = route.request().url()
    if (url.includes('/analytics')) return route.continue()
    if (url.includes('/orders')) return route.continue()
    if (route.request().method() === 'GET') {
      return route.fulfill(json(customer))
    }
    return route.continue()
  })

  // Customer analytics
  await page.route(`${GW}/customers/*/analytics`, (route) => {
    return route.fulfill(json({ customers: [analytics] }))
  })

  // POST /customers (create)
  await page.route(`${GW}/customers`, (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill(json(customer))
    }
    return route.continue()
  })

  // Orders
  await page.route(`${GW}/orders?*`, (route) => {
    return route.fulfill(json({ data: orders, total: orders.length }))
  })
  await page.route(`${GW}/orders`, (route) => {
    return route.fulfill(json({ data: orders, total: orders.length }))
  })
}
