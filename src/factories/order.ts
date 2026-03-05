import type { Order, OrderItem, OrderItemOverrides, OrderOverrides } from '../types'

let orderCounter = 0
let orderItemCounter = 0

export function resetOrderCounters() {
  orderCounter = 0
  orderItemCounter = 0
}

export function createMockOrderItem(overrides: OrderItemOverrides = {}): OrderItem {
  orderItemCounter++
  const unitPrice = overrides.unit_price ?? 10
  const quantity = overrides.quantity ?? 1
  return {
    id: `oi-${String(orderItemCounter).padStart(3, '0')}`,
    product_name: `Test Product ${orderItemCounter}`,
    quantity,
    unit_price: unitPrice,
    line_total: overrides.line_total ?? unitPrice * quantity,
    ...overrides,
  }
}

export function createMockOrder(overrides: OrderOverrides = {}): Order {
  orderCounter++
  const items = overrides.items ?? []
  const subtotal = overrides.subtotal ?? items.reduce((sum, item) => sum + item.line_total, 0)
  const taxAmount = overrides.tax_amount ?? Math.round(subtotal * 0.075 * 100) / 100
  const discountAmount = overrides.discount_amount ?? 0
  const totalAmount = overrides.total_amount ?? Math.round((subtotal + taxAmount - discountAmount) * 100) / 100

  return {
    id: `order-${String(orderCounter).padStart(3, '0')}`,
    order_number: `ORD-${10000 + orderCounter}`,
    status: 'completed',
    items,
    subtotal,
    tax_amount: taxAmount,
    discount_amount: discountAmount,
    total_amount: totalAmount,
    created_at: '2025-01-20T14:30:00Z',
    ...overrides,
  }
}
