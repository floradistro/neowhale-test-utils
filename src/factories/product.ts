import type { Product, PricingTier, PricingTierOverrides, ProductOverrides } from '../types'

let productCounter = 0
let tierCounter = 0

export function resetProductCounters() {
  productCounter = 0
  tierCounter = 0
}

export function createMockPricingTier(overrides: PricingTierOverrides = {}): PricingTier {
  tierCounter++
  return {
    id: `tier-${tierCounter}`,
    label: '1g',
    quantity: 1,
    unit: 'g',
    default_price: 10,
    sort_order: tierCounter,
    ...overrides,
  }
}

export function createMockProduct(overrides: ProductOverrides = {}): Product {
  productCounter++
  const id = overrides.id ?? `prod-${String(productCounter).padStart(3, '0')}`
  return {
    id,
    name: `Test Product ${productCounter}`,
    slug: `test-product-${productCounter}`,
    sku: `TP-${productCounter}`,
    description: `A test product for E2E testing.`,
    status: 'active',
    type: 'simple',
    primary_category_id: 'cat-001',
    featured_image: null,
    image_gallery: [],
    pricing_data: [
      createMockPricingTier({ label: '1g', quantity: 1, default_price: 10 }),
      createMockPricingTier({ label: '3.5g', quantity: 3.5, default_price: 35 }),
    ],
    custom_fields: {},
    stock_quantity: 100,
    ...overrides,
  }
}
