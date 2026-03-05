import type { Cart, CartItem, CartItemOverrides, CartOverrides } from '../types'

let cartItemCounter = 0

export function resetCartCounters() {
  cartItemCounter = 0
}

const TAX_RATE = 0.075

export function createMockCartItem(overrides: CartItemOverrides = {}): CartItem {
  cartItemCounter++
  const unitPrice = overrides.unit_price ?? 10
  const quantity = overrides.quantity ?? 1
  return {
    id: `ci-${String(cartItemCounter).padStart(3, '0')}`,
    product_id: `prod-${String(cartItemCounter).padStart(3, '0')}`,
    product_name: `Test Product ${cartItemCounter}`,
    tier_label: '1g',
    quantity,
    unit_price: unitPrice,
    line_total: overrides.line_total ?? unitPrice * quantity,
    image_url: null,
    ...overrides,
  }
}

export function createMockCart(overrides: CartOverrides = {}): Cart {
  const items = overrides.items ?? []
  const subtotal = overrides.subtotal ?? items.reduce((sum, item) => sum + item.line_total, 0)
  const taxAmount = overrides.tax_amount ?? Math.round(subtotal * TAX_RATE * 100) / 100
  const discountAmount = overrides.discount_amount ?? 0
  const total = overrides.total ?? Math.round((subtotal + taxAmount - discountAmount) * 100) / 100

  return {
    id: 'cart-001',
    items,
    item_count: overrides.item_count ?? items.length,
    subtotal,
    tax_rate: TAX_RATE,
    tax_amount: taxAmount,
    total,
    tax_breakdown: [],
    discount_amount: discountAmount,
    customer_email: null,
    ...overrides,
  }
}
