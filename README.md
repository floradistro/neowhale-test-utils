# @neowhale/test-utils

Test utilities and mock factories for WhaleTools storefronts. Includes Playwright route interceptors, typed mock data factories, and state-seeding helpers for end-to-end testing.

**Version:** 0.1.0
**License:** MIT

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Entry Points](#entry-points)
- [API Reference: Core](#api-reference-core)
  - [WhaleTestConfig](#whaletestconfig)
  - [Factory Functions](#factory-functions)
  - [Counter Reset Functions](#counter-reset-functions)
- [API Reference: Playwright](#api-reference-playwright)
  - [Route Interceptors](#route-interceptors)
  - [Helpers](#helpers)
  - [Utilities](#utilities)
- [Full Test Example](#full-test-example)
- [Peer Dependencies](#peer-dependencies)

---

## Installation

```bash
npm install --save-dev @neowhale/test-utils
```

### Peer Dependencies

| Package | Version | Required |
|---------|---------|----------|
| `@neowhale/storefront` | `>=0.1.0` | Yes |
| `@playwright/test` | `>=1.40.0` | No (only for `/playwright` entry) |

If you only use the core factories (no Playwright), `@playwright/test` is not required.

---

## Quick Start

### Using core factories (no Playwright dependency)

```ts
import {
  createMockProduct,
  createMockCart,
  createMockCartItem,
  createMockCustomer,
} from '@neowhale/test-utils'

const product = createMockProduct({ name: 'Purple Haze' })
const item = createMockCartItem({ product_id: product.id, unit_price: 35 })
const cart = createMockCart({ items: [item] })
const customer = createMockCustomer({ first_name: 'John' })

console.log(cart.total) // auto-computed: subtotal + 7.5% tax
```

### Using Playwright route interceptors

```ts
import { test, expect } from '@playwright/test'
import { mockAllRoutes } from '@neowhale/test-utils/playwright'

const config = {
  storeId: 'your-store-uuid-here',
}

test('homepage loads products', async ({ page }) => {
  const { cart } = await mockAllRoutes(page, config)

  await page.goto('/')
  await expect(page.getByText('Test Product')).toBeVisible()
})
```

---

## Entry Points

| Import Path | Description | Requires Playwright |
|-------------|-------------|---------------------|
| `@neowhale/test-utils` | Core factories, types, counter resets | No |
| `@neowhale/test-utils/playwright` | Route interceptors, helpers, utilities | Yes |

---

## API Reference: Core

Import from `@neowhale/test-utils`.

### WhaleTestConfig

Configuration object used by all Playwright route interceptors and helpers.

```ts
interface WhaleTestConfig {
  /** Store UUID (required) */
  storeId: string
  /** localStorage key prefix. Defaults to "whale" */
  storagePrefix?: string
  /** Client-side proxy path. Defaults to "/api/gw" */
  proxyPath?: string
}
```

### Factory Functions

All factory functions accept an optional `overrides` parameter (`Partial<T>`) that is spread over the defaults. Internal auto-incrementing counters ensure each call produces unique IDs.

#### `createMockProduct(overrides?): Product`

Creates a product with two default pricing tiers (1g at $10, 3.5g at $35), status `"active"`, type `"simple"`, and stock of 100.

```ts
const product = createMockProduct()
// { id: 'prod-001', name: 'Test Product 1', slug: 'test-product-1', ... }

const custom = createMockProduct({
  name: 'Blue Dream',
  stock_quantity: 50,
})
```

#### `createMockPricingTier(overrides?): PricingTier`

Creates a single pricing tier. Called internally by `createMockProduct` but also available directly.

```ts
const tier = createMockPricingTier({ label: '7g', quantity: 7, default_price: 60 })
```

#### `createMockCart(overrides?): Cart`

Creates a cart. When `items` are provided, `subtotal`, `tax_amount` (7.5%), and `total` are automatically computed from the item line totals unless explicitly overridden.

```ts
const emptyCart = createMockCart()
// { id: 'cart-001', items: [], subtotal: 0, tax_amount: 0, total: 0, ... }

const item = createMockCartItem({ unit_price: 35, quantity: 2 })
const cart = createMockCart({ items: [item] })
// subtotal: 70, tax_amount: 5.25, total: 75.25
```

#### `createMockCartItem(overrides?): CartItem`

Creates a cart item. `line_total` is auto-computed as `unit_price * quantity` unless explicitly overridden.

```ts
const item = createMockCartItem({ unit_price: 10, quantity: 3 })
// { id: 'ci-001', line_total: 30, ... }
```

#### `createMockCustomer(overrides?): Customer`

Creates a customer with defaults of Jane Doe, Standard loyalty tier, and zero lifetime spend.

```ts
const customer = createMockCustomer()
// { id: 'cust-001', first_name: 'Jane', last_name: 'Doe', email: 'test1@example.com', ... }

const vip = createMockCustomer({ loyalty_tier: 'VIP', total_spent: 5000 })
```

#### `createMockOrder(overrides?): Order`

Creates an order. Like `createMockCart`, totals (`subtotal`, `tax_amount`, `total_amount`) are auto-computed from items unless overridden. Default status is `"completed"`.

```ts
const orderItem = createMockOrderItem({ unit_price: 50 })
const order = createMockOrder({ items: [orderItem] })
// { id: 'order-001', order_number: 'ORD-10001', total_amount: 53.75, ... }
```

#### `createMockOrderItem(overrides?): OrderItem`

Creates an order item. `line_total` is auto-computed as `unit_price * quantity`.

```ts
const item = createMockOrderItem({ product_name: 'OG Kush', unit_price: 40, quantity: 2 })
// { id: 'oi-001', line_total: 80, ... }
```

#### `createMockAnalytics(overrides?): CustomerAnalytics`

Creates customer analytics data with defaults: `rfm_segment: "loyal_customers"`, `ltv_tier: "standard"`, `churn_risk: "low"`.

```ts
const analytics = createMockAnalytics({ lifetime_revenue: 2500, total_orders: 12 })
```

#### `createMockSendCodeResponse(overrides?): SendCodeResponse`

Creates a send-code response. Default: `{ sent: true }`.

```ts
const response = createMockSendCodeResponse()
```

#### `createMockVerifyResponse(overrides?, customer?): VerifyCodeResponse`

Creates a verify-code response containing a JWT token hash and customer data. The optional second argument provides a customer to include in the response.

```ts
const customer = createMockCustomer({ first_name: 'Alex' })
const response = createMockVerifyResponse({}, customer)
// { object: 'auth_token', token_hash: 'test-jwt-token-abc123', needs_profile: false, customer: ... }
```

#### `createMockSession(storeId, overrides?): StorefrontSession`

Creates a storefront session. Unlike other factories, `storeId` is a required first argument.

```ts
const session = createMockSession('your-store-uuid')
// { id: 'test-session', store_id: 'your-store-uuid', started_at: '...', last_active_at: '...' }
```

### Counter Reset Functions

Factories use auto-incrementing counters for unique IDs. Call these in `beforeEach` or `test.beforeEach` to reset counters between tests and get deterministic IDs.

| Function | Resets |
|----------|--------|
| `resetProductCounters()` | Product and pricing tier counters |
| `resetCartCounters()` | Cart item counter |
| `resetCustomerCounters()` | Customer counter |
| `resetOrderCounters()` | Order and order item counters |

```ts
import {
  resetProductCounters,
  resetCartCounters,
  resetCustomerCounters,
  resetOrderCounters,
} from '@neowhale/test-utils'

test.beforeEach(() => {
  resetProductCounters()
  resetCartCounters()
  resetCustomerCounters()
  resetOrderCounters()
})
```

---

## API Reference: Playwright

Import from `@neowhale/test-utils/playwright`. All functions in this section require `@playwright/test` as a peer dependency.

### Route Interceptors

Route interceptors register `page.route()` handlers that intercept gateway API calls and return mock responses. All accept `(page: Page, config: WhaleTestConfig, opts?)` as arguments.

#### `mockAllRoutes(page, config, opts?): Promise<CartControl>`

Composes all route mocks at once. Returns a `CartControl` object for manipulating cart state during the test. By default also blocks images and mocks Accept.js.

```ts
interface MockAllOpts {
  cart?: MockCartOpts
  auth?: MockAuthOpts
  customer?: MockCustomerOpts
  products?: MockProductOpts
  /** Skip blocking images. Defaults to false. */
  skipImageBlock?: boolean
  /** Skip Accept.js mock. Defaults to false. */
  skipAcceptJs?: boolean
}
```

```ts
const { cart, setCart } = await mockAllRoutes(page, config, {
  skipImageBlock: true,
  auth: { customer: createMockCustomer({ first_name: 'Alex' }) },
})
```

#### `mockAnalyticsRoutes(page, config): Promise<void>`

Mocks storefront session and event endpoints. All routes return `200` responses.

Routes intercepted:
- `POST /storefront/sessions` -- returns a mock session
- `*/storefront/sessions/*` -- returns `{ ok: true }`
- `POST /storefront/events` -- returns `{ ok: true }`
- `*/storefront/events/*` -- returns `{ ok: true }`

#### `mockCartRoutes(page, config, opts?): Promise<CartControl>`

Mocks all cart CRUD routes. Returns a `CartControl` object.

```ts
interface MockCartOpts {
  /** Initial cart state. Defaults to an empty cart. */
  startWith?: Cart
}

interface CartControl {
  /** Current cart state. Mutate directly or use setCart(). */
  cart: Cart
  /** Replace the entire cart state. */
  setCart(cart: Cart): void
}
```

Routes intercepted:
- `POST /cart` and `GET /cart` -- returns current cart
- `GET /cart/:id` -- returns current cart
- `POST /cart/:id/items` -- returns current cart
- `PATCH|PUT /cart/:id/items/:itemId` -- returns current cart
- `DELETE /cart/:id/items/:itemId` -- resets cart to empty, returns it

```ts
const item = createMockCartItem({ unit_price: 25 })
const preloadedCart = createMockCart({ items: [item] })

const { cart, setCart } = await mockCartRoutes(page, config, {
  startWith: preloadedCart,
})

// Later in the test, update the cart
setCart(createMockCart({ items: [] }))
```

#### `mockAuthRoutes(page, config, opts?): Promise<void>`

Mocks passwordless auth endpoints (send-code and verify-code).

```ts
interface MockAuthOpts {
  /** Customer returned on verify. Defaults to createMockCustomer(). */
  customer?: Customer
}
```

Routes intercepted:
- `POST /storefront/auth/send-code` -- returns `{ sent: true }`
- `POST /storefront/auth/verify-code` -- returns token + customer

#### `mockCustomerRoutes(page, config, opts?): Promise<void>`

Mocks customer CRUD, analytics, and order listing endpoints.

```ts
interface MockCustomerOpts {
  /** Customer data. Defaults to createMockCustomer(). */
  customer?: Customer
  /** Analytics data. Defaults to createMockAnalytics(). */
  analytics?: CustomerAnalytics
  /** Orders to return. Defaults to empty array. */
  orders?: Order[]
}
```

Routes intercepted:
- `GET /customers/:id` -- returns customer
- `POST /customers` -- returns customer
- `GET /customers/:id/analytics` -- returns analytics
- `GET /orders` -- returns order list

#### `mockCheckoutRoute(page, config, order?): Promise<void>`

Mocks the checkout endpoint. Returns the given order or a default mock order.

```ts
await mockCheckoutRoute(page, config, createMockOrder({ status: 'pending' }))
```

#### `mockProductRoutes(page, config, opts?): Promise<void>`

Mocks product list and detail endpoints. Defaults to returning two generic products.

```ts
interface MockProductOpts {
  /** Products for list endpoint. Defaults to two generic products. */
  products?: Product[]
  /** Single product for detail endpoint. Defaults to first product in list. */
  singleProduct?: Product
}
```

Routes intercepted:
- `GET /products` -- returns product list with total count
- `GET /products/:id` -- returns single product

#### `mockAcceptJs(page): Promise<void>`

Blocks the real Authorize.net Accept.js script (both production and sandbox domains) and injects a mock `window.Accept` object that synchronously calls the handler with a successful opaque token response.

```ts
await mockAcceptJs(page)
// window.Accept.dispatchData(secureData, handler) is now available
```

### Helpers

#### `seedAuthState(page, config, customer?): Promise<void>`

Pre-sets authentication state in localStorage using the Zustand persist format. Writes to `{storagePrefix}-auth`. The seeded session token is set to expire 30 days from the current time.

```ts
await seedAuthState(page, config, createMockCustomer({ first_name: 'Alex' }))
await page.goto('/')
// User is now "logged in" from the first navigation
```

#### `seedCartState(page, config, cartId?): Promise<void>`

Pre-sets a cart ID in localStorage using the Zustand persist format. Writes to `{storagePrefix}-cart`. Defaults to `"cart-001"`.

```ts
await seedCartState(page, config, 'my-cart-id')
```

#### `blockImages(page): Promise<void>`

Blocks image requests to Supabase storage and the whale-gateway media proxy. Returns a 1x1 transparent PNG for each request. Useful for speeding up tests that do not need real images.

```ts
await blockImages(page)
```

#### `waitForPageReady(page): Promise<void>`

Waits for the page to reach `networkidle` load state.

```ts
await page.goto('/')
await waitForPageReady(page)
```

### Utilities

#### `resolveGatewayGlob(config): string`

Builds the glob pattern used to match gateway API routes based on `proxyPath` and `storeId`.

```ts
const glob = resolveGatewayGlob({ storeId: 'abc-123' })
// '**/api/gw/v1/stores/abc-123'
```

#### `json(data, status?): object`

Shorthand for Playwright `route.fulfill()` options. Returns an object with `status`, `contentType: "application/json"`, and a stringified `body`. Status defaults to `200`.

```ts
await route.fulfill(json({ ok: true }))
await route.fulfill(json({ error: 'Not found' }, 404))
```

#### `TRANSPARENT_PIXEL: Buffer`

A 1x1 transparent PNG encoded as a Node.js `Buffer`. Used internally by `blockImages` and available for custom route handlers.

```ts
await route.fulfill({
  status: 200,
  contentType: 'image/png',
  body: TRANSPARENT_PIXEL,
})
```

---

## Full Test Example

A complete Playwright test demonstrating both entry points together:

```ts
// tests/checkout-flow.spec.ts
import { test, expect } from '@playwright/test'
import {
  createMockProduct,
  createMockCart,
  createMockCartItem,
  createMockCustomer,
  createMockOrder,
  createMockOrderItem,
  resetProductCounters,
  resetCartCounters,
  resetCustomerCounters,
  resetOrderCounters,
} from '@neowhale/test-utils'
import {
  mockAllRoutes,
  mockCheckoutRoute,
  seedAuthState,
  waitForPageReady,
} from '@neowhale/test-utils/playwright'
import type { WhaleTestConfig } from '@neowhale/test-utils'

const config: WhaleTestConfig = {
  storeId: 'cd2e1122-d511-4edb-be5d-98ef274b4baf',
}

test.beforeEach(() => {
  resetProductCounters()
  resetCartCounters()
  resetCustomerCounters()
  resetOrderCounters()
})

test('authenticated user can complete checkout', async ({ page }) => {
  // 1. Create test data
  const product = createMockProduct({ name: 'Purple Haze', stock_quantity: 50 })
  const customer = createMockCustomer({ first_name: 'Alex', last_name: 'Test' })
  const cartItem = createMockCartItem({
    product_id: product.id,
    product_name: product.name,
    unit_price: 35,
    quantity: 1,
  })
  const cart = createMockCart({ items: [cartItem] })
  const order = createMockOrder({
    items: [createMockOrderItem({ product_name: product.name, unit_price: 35 })],
  })

  // 2. Set up route mocks
  const { setCart } = await mockAllRoutes(page, config, {
    cart: { startWith: cart },
    auth: { customer },
    products: { products: [product], singleProduct: product },
  })
  await mockCheckoutRoute(page, config, order)

  // 3. Seed auth state so user is already logged in
  await seedAuthState(page, config, customer)

  // 4. Navigate and interact
  await page.goto('/checkout')
  await waitForPageReady(page)

  await expect(page.getByText('Purple Haze')).toBeVisible()
  await expect(page.getByText('$35.00')).toBeVisible()

  // 5. Complete checkout
  await page.getByRole('button', { name: /place order/i }).click()

  // 6. Verify confirmation
  await expect(page.getByText(order.order_number)).toBeVisible()
})
```

---

## Peer Dependencies

```json
{
  "peerDependencies": {
    "@neowhale/storefront": ">=0.1.0",
    "@playwright/test": ">=1.40.0"
  },
  "peerDependenciesMeta": {
    "@playwright/test": {
      "optional": true
    }
  }
}
```

If you only use the core entry point (`@neowhale/test-utils`), you do not need `@playwright/test` installed. The Playwright dependency is only required when importing from `@neowhale/test-utils/playwright`.
