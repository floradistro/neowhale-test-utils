import type {
  SendCodeResponse,
  VerifyCodeResponse,
  SendCodeResponseOverrides,
  VerifyCodeResponseOverrides,
  Customer,
} from '../types'
import { createMockCustomer } from './customer'

export function createMockSendCodeResponse(overrides: SendCodeResponseOverrides = {}): SendCodeResponse {
  return {
    sent: true,
    ...overrides,
  }
}

export function createMockVerifyResponse(
  overrides: VerifyCodeResponseOverrides = {},
  customer?: Customer,
): VerifyCodeResponse {
  return {
    object: 'auth_token',
    token_hash: 'test-jwt-token-abc123',
    needs_profile: false,
    customer: customer ?? overrides.customer ?? createMockCustomer(),
    ...overrides,
  }
}
