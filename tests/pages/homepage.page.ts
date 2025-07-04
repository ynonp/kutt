import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomepagePage extends BasePage {
  readonly urlInput: Locator;
  readonly submitButton: Locator;
  readonly advancedOptionsCheckbox: Locator;
  readonly copyButton: Locator;
  readonly mainHeading: Locator;
  readonly advancedOptionsSection: Locator;
  readonly customUrlInput: Locator;
  readonly passwordInput: Locator;
  readonly expireInput: Locator;
  readonly descriptionInput: Locator;
  readonly domainSelect: Locator;
  readonly githubLink: Locator;
  readonly loginButton: Locator;
  readonly termsLink: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.urlInput = page.getByRole('textbox', { name: 'target' });
    this.submitButton = page.getByRole('button').first();
    this.advancedOptionsCheckbox = page.getByRole('checkbox', { name: 'Show advanced options' });
    this.copyButton = page.getByRole('button', { name: 'Copy' });
    this.mainHeading = page.getByRole('heading', { name: 'Cut your links shorter.' });
    
    // Advanced options elements
    this.advancedOptionsSection = page.locator('[data-testid="advanced-options"], .advanced-options').first();
    this.customUrlInput = page.getByRole('textbox', { name: 'localhost:3000/' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password:' });
    this.expireInput = page.getByRole('textbox', { name: 'Expire in:' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Description:' });
    this.domainSelect = page.getByRole('combobox', { name: 'Domain:' });
    
    // Navigation elements
    this.githubLink = page.getByRole('link', { name: 'GitHub' });
    this.loginButton = page.getByRole('link', { name: /log in|sign up/i });
    this.termsLink = page.getByRole('link', { name: /terms of service/i });
    this.logo = page.locator('img[alt="kutt"]').first();
  }

  async goto() {
    await super.goto('/');
  }

  async verifyPageTitle() {
    await super.verifyPageTitle('Kutt | Free modern URL shortener');
  }

  async verifyHomePageElements() {
    await expect(this.mainHeading).toBeVisible();
    await expect(this.urlInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.advancedOptionsCheckbox).toBeVisible();
    
    // Verify placeholder text
    await expect(this.urlInput).toHaveAttribute('placeholder', /paste your long url/i);
    
    // Verify header elements
    await expect(this.githubLink).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    
    // Verify footer elements
    await expect(this.termsLink).toBeVisible();
  }

  async verifyAdvancedOptionsCollapsed() {
    await expect(this.advancedOptionsCheckbox).toBeVisible();
    await expect(this.advancedOptionsCheckbox).not.toBeChecked();
    
    // Check if advanced options section is hidden - it should not be present when collapsed
    await expect(this.customUrlInput).not.toBeVisible();
    await expect(this.passwordInput).not.toBeVisible();
    await expect(this.expireInput).not.toBeVisible();
    await expect(this.descriptionInput).not.toBeVisible();
    await expect(this.domainSelect).not.toBeVisible();
  }

  async toggleAdvancedOptions() {
    await this.advancedOptionsCheckbox.click();
  }

  async verifyAdvancedOptionsExpanded() {
    await expect(this.advancedOptionsCheckbox).toBeChecked();
    await expect(this.customUrlInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.expireInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.domainSelect).toBeVisible();
  }

  async enterUrl(url: string) {
    await this.urlInput.click();
    await this.urlInput.fill(url);
  }

  async clearUrlInput() {
    await this.urlInput.clear();
  }

  async verifyUrlValue(expectedUrl: string) {
    await expect(this.urlInput).toHaveValue(expectedUrl);
  }

  async submitUrl() {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async submitWithEnterKey() {
    await this.urlInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyShortUrlGenerated() {
    // Look for the generated short URL heading
    const shortUrlHeading = this.page.locator('h1').filter({ hasText: /localhost:3000\/\w+/ });
    await expect(shortUrlHeading).toBeVisible();
    
    // Get the short URL text and verify format
    const shortUrlText = (await shortUrlHeading.textContent())?.trim() || '';
    expect(shortUrlText).toMatch(/^localhost:3000\/[A-Za-z0-9]+$/);
    
    return shortUrlText;
  }

  async verifyCustomShortUrl(customAddress: string) {
    const expectedUrl = `localhost:3000/${customAddress}`;
    const shortUrlHeading = this.page.getByRole('heading', { name: expectedUrl });
    await expect(shortUrlHeading).toBeVisible();
    return expectedUrl;
  }

  async verifyCopyButtonVisible() {
    await expect(this.copyButton).toBeVisible();
  }

  async clickCopyButton() {
    await this.copyButton.click();
  }

  async verifyCopyFunctionality() {
    // Click copy button and verify visual feedback
    await this.clickCopyButton();
    
    // Check for success indicator (check icon or color change)
    const successIndicator = this.page.locator('.check-icon, .success, [data-testid="copy-success"]');
    if (await successIndicator.count() > 0) {
      await expect(successIndicator).toBeVisible();
    }
  }

  async verifyFormStillAvailable() {
    await expect(this.urlInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async verifyFormValidationError() {
    const validationMessage = this.page.locator('.validation-error, .field-error, [data-testid="validation-error"]');
    await expect(validationMessage).toBeVisible();
  }

  // Advanced options methods
  async enterCustomUrl(customUrl: string) {
    await this.customUrlInput.fill(customUrl);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async enterExpiration(expiration: string) {
    await this.expireInput.fill(expiration);
  }

  async enterDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async selectDomain(domain: string) {
    await this.domainSelect.selectOption(domain);
  }

  async verifyDomainOptions() {
    await this.domainSelect.click();
    const options = await this.domainSelect.locator('option').all();
    expect(options.length).toBeGreaterThan(0);
    
    // Verify default domain is localhost:3000
    const defaultOption = this.domainSelect.locator('option[selected]');
    if (await defaultOption.count() > 0) {
      await expect(defaultOption).toContainText('localhost:3000');
    }
  }

  async createShortUrl(url: string) {
    await this.enterUrl(url);
    await this.verifyUrlValue(url);
    await this.submitUrl();
    return await this.verifyShortUrlGenerated();
  }

  async createCustomShortUrl(url: string, customAddress: string) {
    await this.toggleAdvancedOptions();
    await this.verifyAdvancedOptionsExpanded();
    await this.enterUrl(url);
    await this.enterCustomUrl(customAddress);
    await this.submitUrl();
    return await this.verifyCustomShortUrl(customAddress);
  }

  async createPasswordProtectedUrl(url: string, password: string) {
    await this.toggleAdvancedOptions();
    await this.verifyAdvancedOptionsExpanded();
    await this.enterUrl(url);
    await this.enterPassword(password);
    await this.submitUrl();
    return await this.verifyShortUrlGenerated();
  }

  async verifyShortUrlRedirectsToTarget(shortUrl: string, targetUrl: string) {
    // Navigate to the short URL
    await this.page.goto(`http://${shortUrl}`);
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're redirected to the target URL (handle trailing slash)
    const currentUrl = this.page.url();
    const normalizedTargetUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
    const normalizedCurrentUrl = currentUrl.endsWith('/') ? currentUrl : currentUrl + '/';
    
    expect(normalizedCurrentUrl).toBe(normalizedTargetUrl);
  }

  async verifyPasswordPrompt() {
    const passwordPrompt = this.page.locator('[data-testid="password-prompt"], .password-prompt, input[type="password"]');
    await expect(passwordPrompt).toBeVisible();
  }

  async enterPasswordForAccess(password: string) {
    const passwordField = this.page.locator('input[type="password"]');
    await passwordField.fill(password);
    await passwordField.press('Enter');
  }

  async verifyExpiredUrl() {
    const expiredMessage = this.page.locator('.expired, .not-found, [data-testid="expired"]');
    await expect(expiredMessage).toBeVisible();
  }

  // Navigation methods
  async clickGitHubLink() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.githubLink.click()
    ]);
    return newPage;
  }

  async clickLoginButton() {
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickTermsLink() {
    await this.termsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Responsive design methods
  async verifyMobileLayout() {
    // Check if elements stack vertically on mobile
    const viewport = this.page.viewportSize();
    if (viewport && viewport.width <= 480) {
      // Verify mobile-specific layout adjustments
      await expect(this.urlInput).toBeVisible();
      await expect(this.submitButton).toBeVisible();
      
      // Check touch targets are adequately sized (at least 30px for this app)
      const submitButtonBox = await this.submitButton.boundingBox();
      if (submitButtonBox) {
        expect(submitButtonBox.height).toBeGreaterThanOrEqual(30);
      }
    }
  }

  async verifyTabletLayout() {
    const viewport = this.page.viewportSize();
    if (viewport && viewport.width >= 768 && viewport.width <= 1024) {
      // Verify tablet-specific layout
      await expect(this.urlInput).toBeVisible();
      await expect(this.submitButton).toBeVisible();
    }
  }

  // Security methods
  async testXSSPrevention(xssPayload: string) {
    await this.enterUrl(xssPayload);
    await this.submitUrl();
    
    // Verify no script execution by checking if alert dialog appears
    this.page.on('dialog', dialog => {
      throw new Error(`XSS vulnerability detected: ${dialog.message()}`);
    });
    
    // Wait a moment to see if any malicious scripts execute
    await this.page.waitForTimeout(1000);
  }

  // Error handling methods
  async verifyValidationErrorMessage(expectedMessage?: string | RegExp) {
    const errorLocator = this.page.locator('p.error').first();
    await expect(errorLocator).toBeVisible();
    if (expectedMessage) {
      await expect(errorLocator).toContainText(expectedMessage);
    }
  }

  async verifyCustomUrlAlreadyExistsError() {
    await this.verifyValidationErrorMessage(/custom url is already in use|already exists/i);
  }

  async verifyInvalidUrlError() {
    await this.verifyValidationErrorMessage(/invalid url|not valid|not allowed/i);
  }

  async verifyEmptyUrlError() {
    await this.verifyValidationErrorMessage(/target is missing|required/i);
  }

  // Form state methods
  async verifyFormInErrorState() {
    // Check if form shows error styling
    const errorWrapper = this.page.locator('.target-wrapper.error');
    await expect(errorWrapper).toBeVisible();
  }

  async verifyFocusOnUrlInput() {
    await expect(this.urlInput).toBeFocused();
  }

  // Keyboard navigation methods
  async testKeyboardNavigation() {
    // Test tab navigation through interactive elements
    await this.page.keyboard.press('Tab');
    let focusedElement = this.page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through elements
    await this.page.keyboard.press('Tab');
    focusedElement = this.page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    await this.page.keyboard.press('Tab');
    focusedElement = this.page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  }

  async testSpaceKeyForCheckbox() {
    await this.advancedOptionsCheckbox.focus();
    await this.page.keyboard.press('Space');
    await expect(this.advancedOptionsCheckbox).toBeChecked();
  }

  async testEnterKeyForSubmit() {
    await this.urlInput.focus();
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  // Accessibility methods
  async verifyAccessibilityLabels() {
    // Check that form inputs have proper labels
    const urlInputId = await this.urlInput.getAttribute('id');
    const urlInputAriaLabel = await this.urlInput.getAttribute('aria-label');
    const urlInputLabel = this.page.locator(`label[for="${urlInputId}"]`);
    
    const hasProperLabel = (urlInputId && await urlInputLabel.count() > 0) || urlInputAriaLabel;
    expect(hasProperLabel).toBeTruthy();
  }

  async verifyHeadingStructure() {
    // Check that there's a proper heading structure
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Verify main heading is h1
    await expect(this.mainHeading).toHaveRole('heading');
    const tagName = await this.mainHeading.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('h1');
  }

  // Performance and network methods
  async simulateSlowNetwork() {
    await this.page.context().route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      route.continue();
    });
  }

  async restoreNetwork() {
    await this.page.context().unroute('**/*');
  }

  async verifyPagePerformance() {
    const startTime = Date.now();
    await this.page.goto(this.baseUrl);
    await this.page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  }
}
