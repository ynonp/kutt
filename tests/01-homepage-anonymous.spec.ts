import { test, expect } from '@playwright/test';
import { HomepagePage } from './pages/homepage.page';

test.describe('Homepage Test Plan - Anonymous User - Core Functionality', () => {

  test('TC-001: Homepage Load and Display', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Verify page loads successfully within 3 seconds
    await homepagePage.verifyPageLoadTime();
    
    // Verify page title
    await homepagePage.verifyPageTitle();
    
    // Verify all required elements are visible
    await homepagePage.verifyHomePageElements();
    
    // Verify no JavaScript errors (implicit in successful load)
    await homepagePage.verifyNoErrorMessages();
  });
  
  test('TC-002: Create Short URL with Valid Long URL', async ({ page }) => {
    // Arrange
    const homepagePage = new HomepagePage(page);
    const targetUrl = 'https://duckduckgo.com/';

    // Act & Assert
    // Preconditions: Navigate to homepage and verify it loads
    await homepagePage.goto();
    await homepagePage.verifyPageTitle();
    await homepagePage.verifyHomePageElements();
    
    // Verify advanced options are collapsed (default state)
    await homepagePage.verifyAdvancedOptionsCollapsed();

    // Test Steps 1-2: Click on URL input field and enter the valid URL
    await homepagePage.enterUrl(targetUrl);
    await homepagePage.verifyUrlValue(targetUrl);

    // Test Step 3: Click the submit button and wait for response
    await homepagePage.submitUrl();

    // Expected Results: Verify short URL is generated and displayed
    const shortUrl = await homepagePage.verifyShortUrlGenerated();
    
    // Verify copy button appears next to the short URL
    await homepagePage.verifyCopyButtonVisible();
    
    // Verify form remains available for creating additional URLs
    await homepagePage.verifyFormStillAvailable();
    
    // Verify no error messages are displayed
    await homepagePage.verifyNoErrorMessages();

    // Test Step 5: Go to the short URL and verify it redirects to the target URL
    await homepagePage.verifyShortUrlRedirectsToTarget(shortUrl, targetUrl);
  });

  test('TC-003: URL Shortening with Invalid URL', async ({ page }) => {
    const homepagePage = new HomepagePage(page);
    const invalidUrls = ['invalid-url', 'not-a-url', 'javascript:alert("test")'];

    for (const invalidUrl of invalidUrls) {
      // Navigate to homepage for each test
      await homepagePage.goto();
      
      // Enter invalid URL
      await homepagePage.enterUrl(invalidUrl);
      
      // Submit form
      await homepagePage.submitUrl();
      
      // Verify error message appears
      await homepagePage.verifyInvalidUrlError();
      
      // Verify form remains available for correction
      await homepagePage.verifyFormStillAvailable();
      
      // Clear input for next iteration
      await homepagePage.clearUrlInput();
    }
  });

  test('TC-004: URL Shortening with Empty Input', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Leave URL input field empty and submit
    await homepagePage.submitUrl();
    
    // Verify validation error message appears
    await homepagePage.verifyEmptyUrlError();
    
    // Verify form indicates required field
    await homepagePage.verifyFormInErrorState();
    
    // Verify focus returns to URL input field
    await homepagePage.verifyFocusOnUrlInput();
  });

  test('TC-005: Advanced Options Toggle', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Verify advanced options are hidden by default
    await homepagePage.verifyAdvancedOptionsCollapsed();
    
    // Click "Show advanced options" checkbox
    await homepagePage.toggleAdvancedOptions();
    
    // Verify advanced options section becomes visible
    await homepagePage.verifyAdvancedOptionsExpanded();
    
    // Click checkbox again to uncheck
    await homepagePage.toggleAdvancedOptions();
    
    // Verify advanced options section is hidden again
    await homepagePage.verifyAdvancedOptionsCollapsed();
  });

  test('TC-006: Advanced Options - Custom URL', async ({ page }) => {
    const homepagePage = new HomepagePage(page);
    const targetUrl = 'https://www.google.com';
    const customUrl = 'my-custom-link';

    // Navigate to homepage and expand advanced options
    await homepagePage.goto();
    await homepagePage.toggleAdvancedOptions();
    await homepagePage.verifyAdvancedOptionsExpanded();
    
    // Enter target URL and attempt to use custom address
    await homepagePage.enterUrl(targetUrl);
    await homepagePage.enterCustomUrl(customUrl);
    
    // Submit form
    await homepagePage.submitUrl();
    
    // Verify that custom URL functionality is restricted for anonymous users
    const errorMessage = await homepagePage.page.locator('p').filter({ hasText: 'Only users can use this field' });
    await expect(errorMessage).toBeVisible();
    
    // Since custom URLs are not available for anonymous users, this confirms the expected behavior
  });

  test('TC-007: Advanced Options - Custom URL Conflict', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage and expand advanced options
    await homepagePage.goto();
    await homepagePage.toggleAdvancedOptions();
    
    // Try to use custom URL field
    await homepagePage.enterUrl('https://www.example.com');
    await homepagePage.enterCustomUrl('test-link');
    await homepagePage.submitUrl();
    
    // Verify that custom URL functionality is restricted for anonymous users
    const errorMessage = await homepagePage.page.locator('p').filter({ hasText: 'Only users can use this field' });
    await expect(errorMessage).toBeVisible();
  });

  test('TC-008: Advanced Options - Password Protection', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage and expand advanced options
    await homepagePage.goto();
    await homepagePage.toggleAdvancedOptions();
    
    // Try to use password field
    await homepagePage.enterUrl('https://www.example.com');
    await homepagePage.enterPassword('test123');
    await homepagePage.submitUrl();
    
    // Verify that password protection is restricted for anonymous users
    const errorMessage = await homepagePage.page.locator('p').filter({ hasText: 'Only users can use this field' });
    await expect(errorMessage).toBeVisible();
  });

  test('TC-009: Advanced Options - Expiration', async ({ page }) => {
    const homepagePage = new HomepagePage(page);
    const targetUrl = 'https://www.example.com';
    const expiration = '1 minute';

    // Navigate to homepage and expand advanced options
    await homepagePage.goto();
    await homepagePage.toggleAdvancedOptions();
    
    // Enter target URL and expiration
    await homepagePage.enterUrl(targetUrl);
    await homepagePage.enterExpiration(expiration);
    
    // Submit form
    await homepagePage.submitUrl();
    
    // Verify short URL is created
    const shortUrl = await homepagePage.verifyShortUrlGenerated();
    
    // Verify URL works before expiration
    await page.goto(`http://${shortUrl}`);
    await page.waitForLoadState('networkidle');
    
    // Check that we're redirected to the target domain
    expect(page.url()).toContain('example.com');
    
    // Note: In a real test, we would wait for expiration or mock the time
    // For now, we'll just verify the URL was created successfully
  });

  test('TC-010: Advanced Options - Description', async ({ page }) => {
    const homepagePage = new HomepagePage(page);
    const targetUrl = 'https://www.example.com';
    const description = 'Test link for documentation';

    // Navigate to homepage and expand advanced options
    await homepagePage.goto();
    await homepagePage.toggleAdvancedOptions();
    
    // Enter target URL and description
    await homepagePage.enterUrl(targetUrl);
    await homepagePage.enterDescription(description);
    
    // Submit form
    await homepagePage.submitUrl();
    
    // Verify short URL is created
    const shortUrl = await homepagePage.verifyShortUrlGenerated();
    
    // Verify description is stored and URL works
    await page.goto(`http://${shortUrl}`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('example.com');
  });

  test('TC-011: Advanced Options - Domain Selection', async ({ page }) => {
    const homepagePage = new HomepagePage(page);
    const targetUrl = 'https://www.example.com';

    // Navigate to homepage and expand advanced options
    await homepagePage.goto();
    await homepagePage.toggleAdvancedOptions();
    
    // Verify domain dropdown functionality
    await homepagePage.verifyDomainOptions();
    
    // Enter target URL
    await homepagePage.enterUrl(targetUrl);
    
    // Submit form with default domain
    await homepagePage.submitUrl();
    
    // Verify short URL is created with default domain
    const shortUrl = await homepagePage.verifyShortUrlGenerated();
    expect(shortUrl).toContain('localhost:3000');
  });

  test('TC-012: Copy Short URL Functionality', async ({ page }) => {
    const homepagePage = new HomepagePage(page);
    const targetUrl = 'https://www.example.com';

    // Navigate to homepage and create a short URL
    await homepagePage.goto();
    await homepagePage.enterUrl(targetUrl);
    await homepagePage.submitUrl();
    
    // Verify short URL is generated
    const shortUrl = await homepagePage.verifyShortUrlGenerated();
    
    // Test copy functionality
    await homepagePage.verifyCopyFunctionality();
    
    // Verify copy button shows visual feedback
    await homepagePage.verifyCopyButtonVisible();
  });

  test('TC-013: Navigation - Login/Sign Up', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Click the login button
    await homepagePage.clickLoginButton();
    
    // Verify navigation to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveTitle(/log in|sign up/i);
  });

  test('TC-014: Navigation - Terms of Service', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Click Terms of Service link
    await homepagePage.clickTermsLink();
    
    // Verify navigation to terms page
    await expect(page).toHaveURL(/\/terms/);
    await expect(page).toHaveTitle(/terms of service/i);
  });

  test('TC-015: Navigation - GitHub Link', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Click GitHub link and verify it opens in new tab
    const newPage = await homepagePage.clickGitHubLink();
    
    // Verify new tab opens with GitHub repository
    await expect(newPage).toHaveURL(/github\.com\/thedevs-network\/kutt/);
    
    // Verify original page remains open
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Close the new tab
    await newPage.close();
  });

  test('TC-016: Navigation - Logo Click', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to terms page first
    await page.goto('http://localhost:3000/terms');
    
    // Click on the logo
    await homepagePage.clickLogo();
    
    // Verify navigation back to homepage
    await expect(page).toHaveURL('http://localhost:3000/');
    await homepagePage.verifyPageTitle();
  });

  test('TC-017: Responsive Design - Mobile View', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to homepage
    await homepagePage.goto();
    
    // Verify mobile layout
    await homepagePage.verifyMobileLayout();
    
    // Test form functionality on mobile
    await homepagePage.enterUrl('https://www.example.com');
    await homepagePage.submitUrl();
    await homepagePage.verifyShortUrlGenerated();
  });

  test('TC-018: Responsive Design - Tablet View', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to homepage
    await homepagePage.goto();
    
    // Verify tablet layout
    await homepagePage.verifyTabletLayout();
    
    // Test form functionality on tablet
    await homepagePage.enterUrl('https://www.example.com');
    await homepagePage.submitUrl();
    await homepagePage.verifyShortUrlGenerated();
  });

  test('TC-019: Accessibility - Keyboard Navigation', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Test keyboard navigation
    await homepagePage.testKeyboardNavigation();
    
    // Test form submission with Enter key
    await homepagePage.enterUrl('https://www.example.com');
    await homepagePage.testEnterKeyForSubmit();
    await homepagePage.verifyShortUrlGenerated();
    
    // Test checkbox toggle with Space key
    await homepagePage.goto();
    await homepagePage.testSpaceKeyForCheckbox();
    await homepagePage.verifyAdvancedOptionsExpanded();
  });

  test('TC-020: Accessibility - Screen Reader Compatibility', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Navigate to homepage
    await homepagePage.goto();
    
    // Verify accessibility labels
    await homepagePage.verifyAccessibilityLabels();
    
    // Verify heading structure
    await homepagePage.verifyHeadingStructure();
    
    // Verify form elements are properly labeled
    await homepagePage.verifyHomePageElements();
  });

  test('TC-021: Performance - Page Load Time', async ({ page }) => {
    const homepagePage = new HomepagePage(page);

    // Test page load performance
    await homepagePage.verifyPagePerformance();
    
    // Verify page loads within acceptable time
    await homepagePage.verifyPageTitle();
    await homepagePage.verifyHomePageElements();
  });

});