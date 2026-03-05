import type {
  Product,
  PricingTier,
  Cart,
  CartItem,
  Customer,
  Order,
  OrderItem,
  CustomerAnalytics,
  SendCodeResponse,
  VerifyCodeResponse,
  StorefrontSession,
} from '@neowhale/storefront'

// ─── Test Config ─────────────────────────────────────────────────────────────

export interface WhaleTestConfig {
  /** Store UUID (required) */
  storeId: string
  /** localStorage key prefix. Defaults to "whale" */
  storagePrefix?: string
  /** Client-side proxy path. Defaults to "/api/gw" */
  proxyPath?: string
}

// ─── Factory Override Types ──────────────────────────────────────────────────

export type ProductOverrides = Partial<Product>
export type PricingTierOverrides = Partial<PricingTier>
export type CartOverrides = Partial<Cart>
export type CartItemOverrides = Partial<CartItem>
export type CustomerOverrides = Partial<Customer>
export type OrderOverrides = Partial<Order>
export type OrderItemOverrides = Partial<OrderItem>
export type CustomerAnalyticsOverrides = Partial<CustomerAnalytics>
export type SendCodeResponseOverrides = Partial<SendCodeResponse>
export type VerifyCodeResponseOverrides = Partial<VerifyCodeResponse>
export type SessionOverrides = Partial<StorefrontSession>

// ─── Re-export SDK types for convenience ─────────────────────────────────────

export type {
  Product,
  PricingTier,
  Cart,
  CartItem,
  Customer,
  Order,
  OrderItem,
  CustomerAnalytics,
  SendCodeResponse,
  VerifyCodeResponse,
  StorefrontSession,
}
