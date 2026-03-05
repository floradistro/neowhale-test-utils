import type { Page } from '@playwright/test'
import type { Customer, WhaleTestConfig } from '../../types'
import { createMockCustomer } from '../../factories/customer'

/**
 * Pre-set auth state in localStorage using Zustand persist format.
 * Writes to `{storagePrefix}-auth`.
 */
export async function seedAuthState(page: Page, config: WhaleTestConfig, customer?: Customer) {
  const prefix = config.storagePrefix ?? 'whale'
  const cust = customer ?? createMockCustomer()

  await page.addInitScript(([key, c]) => {
    localStorage.setItem(key, JSON.stringify({
      state: {
        sessionToken: 'test-jwt-token-abc123',
        sessionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        customer: JSON.parse(c),
      },
      version: 0,
    }))
  }, [`${prefix}-auth`, JSON.stringify(cust)] as const)
}

/**
 * Pre-set cart state in localStorage using Zustand persist format.
 * Writes to `{storagePrefix}-cart`.
 */
export async function seedCartState(page: Page, config: WhaleTestConfig, cartId = 'cart-001') {
  const prefix = config.storagePrefix ?? 'whale'

  await page.addInitScript(([key, id]) => {
    localStorage.setItem(key, JSON.stringify({
      state: { cartId: id },
      version: 0,
    }))
  }, [`${prefix}-cart`, cartId] as const)
}
