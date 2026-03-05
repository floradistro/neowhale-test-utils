import type { Page } from '@playwright/test'
import type { Cart, WhaleTestConfig } from '../../types'
import { createMockCart } from '../../factories/cart'
import { resolveGatewayGlob, json } from '../utils'

export interface CartControl {
  /** Current cart state. Mutate directly or use setCart(). */
  cart: Cart
  /** Replace the entire cart state */
  setCart(cart: Cart): void
}

export interface MockCartOpts {
  /** Initial cart state. Defaults to an empty cart. */
  startWith?: Cart
}

export async function mockCartRoutes(
  page: Page,
  config: WhaleTestConfig,
  opts?: MockCartOpts,
): Promise<CartControl> {
  const GW = resolveGatewayGlob(config)

  const control: CartControl = {
    cart: structuredClone(opts?.startWith ?? createMockCart()),
    setCart(cart: Cart) {
      this.cart = structuredClone(cart)
    },
  }

  // POST /cart (create) and GET /cart
  await page.route(`${GW}/cart`, (route) => {
    return route.fulfill(json(control.cart))
  })

  // GET /cart/:id
  await page.route(`${GW}/cart/*`, (route) => {
    const url = route.request().url()
    if (url.includes('/items') || url.includes('/checkout')) return route.continue()
    return route.fulfill(json(control.cart))
  })

  // POST /cart/:id/items (add item)
  await page.route(`${GW}/cart/*/items`, (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill(json(control.cart))
    }
    return route.continue()
  })

  // PATCH/DELETE /cart/:id/items/:itemId
  await page.route(`${GW}/cart/*/items/*`, (route) => {
    const method = route.request().method()
    if (method === 'PATCH' || method === 'PUT') {
      return route.fulfill(json(control.cart))
    }
    if (method === 'DELETE') {
      control.cart = structuredClone(createMockCart())
      return route.fulfill(json(control.cart))
    }
    return route.continue()
  })

  return control
}
