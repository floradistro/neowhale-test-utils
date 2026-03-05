import type { Customer, CustomerOverrides } from '../types'

let customerCounter = 0

export function resetCustomerCounters() {
  customerCounter = 0
}

export function createMockCustomer(overrides: CustomerOverrides = {}): Customer {
  customerCounter++
  return {
    id: `cust-${String(customerCounter).padStart(3, '0')}`,
    first_name: 'Jane',
    last_name: 'Doe',
    email: `test${customerCounter}@example.com`,
    phone: '+15550001234',
    loyalty_tier: 'Standard',
    loyalty_points: 0,
    total_spent: 0,
    total_orders: 0,
    is_staff: false,
    email_consent: true,
    sms_consent: false,
    created_at: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}
