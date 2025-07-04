import { test, expect } from '@playwright/test';
import { HomepagePage } from './pages/homepage.page';

test('has title', async ({ page }) => {
  const homepage = new HomepagePage(page);
  await homepage.goto();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Kutt/);
});
