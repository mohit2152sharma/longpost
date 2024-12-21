import { expect, test } from '@playwright/test';


test.describe("Tests for Landing page", () => {
	test('Get Started button redirects to login', async ({ page }) => {
		await page.goto('/');
		await page.locator('#get-started-button').click()
		await expect(page).toHaveURL('/login')
	});
	
	test("Title of landing page is Longpost with underline", async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('h1')).toHaveText('Longpost')
		await expect(page.locator('h1')).toBeVisible()

		const textDecoration = await page.locator('h1').evaluate((el) => window.getComputedStyle(el).getPropertyValue('text-decoration'))
		expect(textDecoration).toContain('underline')
	})
})
