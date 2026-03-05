import type { StorefrontSession, SessionOverrides } from '../types'

export function createMockSession(storeId: string, overrides: SessionOverrides = {}): StorefrontSession {
  return {
    id: 'test-session',
    store_id: storeId,
    started_at: new Date().toISOString(),
    last_active_at: new Date().toISOString(),
    ...overrides,
  }
}
