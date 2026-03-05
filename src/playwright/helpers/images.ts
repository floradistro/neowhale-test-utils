import type { Page } from '@playwright/test'
import { TRANSPARENT_PIXEL } from '../utils'

/** Block common image sources and return a 1x1 transparent PNG */
export async function blockImages(page: Page) {
  // Block Supabase storage images
  await page.route('**/supabase.co/storage/**', (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: TRANSPARENT_PIXEL,
    })
  })
  // Block gateway media proxy
  await page.route('**/whale-gateway.fly.dev/**/media?*', (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: TRANSPARENT_PIXEL,
    })
  })
}
