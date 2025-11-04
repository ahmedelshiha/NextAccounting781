import { test, expect } from '@playwright/test'

/**
 * DEPRECATION NOTICE (Phase 6):
 * These tests verify the Entities tab behavior when RETIRE_ENTITIES_TAB feature flag is disabled.
 *
 * Feature Flag Status:
 * - When RETIRE_ENTITIES_TAB=false (default): Entities tab is visible and these tests pass
 * - When RETIRE_ENTITIES_TAB=true: Entities tab is hidden; requests redirect to Dashboard tab with role filters
 *
 * Timeline:
 * - Current: Tests validate backward compatibility (FF off)
 * - Post-Rollout (30+ days): Can be removed after telemetry confirms zero legacy API usage
 *
 * Migration Path:
 * /admin/users?tab=entities&type=clients → /admin/users?tab=dashboard&role=CLIENT
 * /admin/users?tab=entities&type=team → /admin/users?tab=dashboard&role=TEAM_MEMBER
 */

async function devLoginAndSetCookie(page: any, request: any, baseURL: string | undefined, email: string) {
  const base = baseURL || process.env.E2E_BASE_URL || 'http://localhost:3000'
  const res = await request.post(`${base}/api/_dev/login`, { data: { email } })
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  const token = json.token as string
  const url = new URL(base)
  await page.context().addCookies([
    { name: '__Secure-next-auth.session-token', value: token, domain: url.hostname, path: '/', httpOnly: false, secure: false, sameSite: 'Lax' },
  ])
}

test.describe('Entities tab unified behavior (backward compatibility)', () => {
  test.beforeEach(async ({ page, request, baseURL }) => {
    await devLoginAndSetCookie(page, request, baseURL, 'admin@accountingfirm.com')
  })

  test('clients sub-tab shows list when feature flag is disabled', async ({ page }) => {
    await page.goto('/admin/users?tab=entities&type=clients')
    // Check if Entities tab is visible (FF off) or redirected (FF on)
    const entitiesTab = page.getByRole('tab', { name: /entities/i })
    const isVisible = await entitiesTab.isVisible({ timeout: 2000 }).catch(() => false)

    if (isVisible) {
      // FF is OFF: test the entities tab
      await expect(page.getByRole('tab', { name: /clients/i })).toBeVisible({ timeout: 5000 })
      await expect(page.getByRole('heading', { name: /client management/i })).toBeVisible({ timeout: 5000 })
    } else {
      // FF is ON: verify redirect to dashboard
      expect(page.url()).toMatch(/tab=dashboard/)
      expect(page.url()).toMatch(/role=CLIENT/)
    }
  })

  test('team sub-tab shows team grid when feature flag is disabled', async ({ page }) => {
    await page.goto('/admin/users?tab=entities&type=team')
    // Check if Entities tab is visible (FF off) or redirected (FF on)
    const entitiesTab = page.getByRole('tab', { name: /entities/i })
    const isVisible = await entitiesTab.isVisible({ timeout: 2000 }).catch(() => false)

    if (isVisible) {
      // FF is OFF: test the entities tab
      await expect(page.getByRole('tab', { name: /team/i })).toBeVisible({ timeout: 5000 })
      await expect(page.getByText(/total members/i)).toBeVisible({ timeout: 5000 })
    } else {
      // FF is ON: verify redirect to dashboard
      expect(page.url()).toMatch(/tab=dashboard/)
      expect(page.url()).toMatch(/role=TEAM_MEMBER/)
    }
  })

  test('entities tab appears in navigation when feature flag is disabled', async ({ page }) => {
    await page.goto('/admin/users')
    const entitiesTab = page.getByRole('tab', { name: /entities/i })
    const isVisible = await entitiesTab.isVisible({ timeout: 2000 }).catch(() => false)

    if (isVisible) {
      // FF is OFF: tab should be visible
      await expect(entitiesTab).toBeVisible()
      await expect(page.getByRole('tab', { name: /roles & permissions/i })).toBeVisible()
    } else {
      // FF is ON: entities tab should be hidden
      await expect(entitiesTab).not.toBeVisible()
      // Dashboard and RBAC tabs should still be visible
      await expect(page.getByRole('tab', { name: /dashboard/i })).toBeVisible()
      await expect(page.getByRole('tab', { name: /roles & permissions/i })).toBeVisible()
    }
  })
})
