import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly baseUrl: string = 'http://localhost:3000';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(`${this.baseUrl}${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPageTitle(expectedTitle: string | RegExp) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyNoErrorMessages() {
    await expect(this.page.locator('.error, .alert-error, [data-testid="error"]')).toHaveCount(0);
  }

  async verifyErrorMessage(expectedMessage: string | RegExp) {
    const errorLocator = this.page.locator('.error, .alert-error, [data-testid="error"]');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(expectedMessage);
  }

  async checkAccessibility() {
    // Basic accessibility checks - heading structure
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Check for proper form labels
    const inputs = await this.page.locator('input').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const associatedLabel = this.page.locator(`label[for="${id}"]`);
      
      if (id) {
        const hasLabel = await associatedLabel.count() > 0;
        const hasAriaLabel = ariaLabel !== null;
        expect(hasLabel || hasAriaLabel).toBeTruthy();
      }
    }
  }

  async verifyKeyboardNavigation() {
    // Test tab navigation
    await this.page.keyboard.press('Tab');
    const focusedElement = this.page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  }

  async verifyPageLoadTime() {
    const startTime = Date.now();
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds max
  }

  async simulateNetworkError() {
    await this.page.route('**/*', route => route.abort());
  }

  async restoreNetwork() {
    await this.page.unroute('**/*');
  }
}
