import type { CustomerAnalytics, CustomerAnalyticsOverrides } from '../types'

export function createMockAnalytics(overrides: CustomerAnalyticsOverrides = {}): CustomerAnalytics {
  return {
    customer_id: 'cust-001',
    customer_name: 'Jane Doe',
    rfm_segment: 'loyal_customers',
    ltv_tier: 'standard',
    lifetime_revenue: 0,
    total_orders: 0,
    avg_order_value: 0,
    last_order_date: '2025-01-20T14:30:00Z',
    recency_days: 5,
    churn_risk: 'low',
    ...overrides,
  }
}
