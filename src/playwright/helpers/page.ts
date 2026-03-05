import type { Page } from '@playwright/test'

/** Wait for the page to reach network idle state */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle')
}
