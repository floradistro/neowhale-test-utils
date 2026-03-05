import type { Page } from '@playwright/test'

/** Mock Authorize.net Accept.js — blocks the real script and injects a fake window.Accept */
export async function mockAcceptJs(page: Page) {
  await page.route('**/js.authorize.net/**', (route) => route.abort())
  await page.route('**/jstest.authorize.net/**', (route) => route.abort())

  await page.addInitScript(() => {
    ;(window as any).Accept = {
      dispatchData: (
        _secureData: any,
        handler: (response: any) => void,
      ) => {
        handler({
          opaqueData: {
            dataDescriptor: 'COMMON.ACCEPT.INAPP.PAYMENT',
            dataValue: 'mock-opaque-token-abc123',
          },
          messages: {
            resultCode: 'Ok',
            message: [{ code: 'I_WC_01', text: 'Successful.' }],
          },
        })
      },
    }
  })
}
