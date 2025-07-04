# Test Suite Documentation

This test suite implements all 25 test cases from the Homepage Test Plan for anonymous users.

## Test Organization

The tests are organized into multiple files for better maintainability:

### 01-homepage-anonymous.spec.ts
- **TC-001**: Homepage Load and Display  
- **TC-002**: Create Short URL with Valid Long URL

### 02-advanced-options.spec.ts
- **TC-005**: Advanced Options Toggle
- **TC-006**: Advanced Options - Custom URL
- **TC-007**: Advanced Options - Custom URL Conflict
- **TC-008**: Advanced Options - Password Protection
- **TC-009**: Advanced Options - Expiration
- **TC-010**: Advanced Options - Description
- **TC-011**: Advanced Options - Domain Selection

### 03-navigation.spec.ts
- **TC-013**: Navigation - Login/Sign Up
- **TC-014**: Navigation - Terms of Service
- **TC-015**: Navigation - GitHub Link
- **TC-016**: Navigation - Logo Click

### 04-responsive-accessibility.spec.ts
- **TC-017**: Responsive Design - Mobile View
- **TC-018**: Responsive Design - Tablet View
- **TC-019**: Accessibility - Keyboard Navigation
- **TC-020**: Accessibility - Screen Reader Compatibility

### 05-performance-security.spec.ts
- **TC-021**: Performance - Page Load Time
- **TC-022**: Cross-Browser Compatibility
- **TC-023**: Error Handling - Network Issues
- **TC-024**: Security - XSS Prevention
- **TC-025**: URL Redirection

### 06-form-validation.spec.ts
- **TC-003**: URL Shortening with Invalid URL
- **TC-004**: URL Shortening with Empty Input
- **TC-012**: Copy Short URL Functionality

## Page Objects

### BasePage
Common functionality for all pages:
- Navigation and page loading
- Error handling verification
- Accessibility checks
- Performance testing
- Network simulation

### HomepagePage
Specific to homepage functionality:
- URL shortening operations
- Advanced options management
- Form validation
- Copy functionality
- Responsive design verification
- Security testing

### LoginPage
Login/authentication page functionality:
- Login form verification
- Navigation to/from login

### TermsPage
Terms of service page functionality:
- Terms page verification
- Navigation testing

## Running the Tests

To run all tests:
```bash
npx playwright test
```

To run specific test suites:
```bash
npx playwright test 01-homepage-anonymous.spec.ts
npx playwright test 02-advanced-options.spec.ts
npx playwright test 03-navigation.spec.ts
npx playwright test 04-responsive-accessibility.spec.ts
npx playwright test 05-performance-security.spec.ts
npx playwright test 06-form-validation.spec.ts
```

To run tests in headed mode:
```bash
npx playwright test --headed
```

To run tests in a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Requirements

Before running the tests:

1. **Server must be running**: Ensure the Kutt application is running on `http://localhost:3000`
2. **Database setup**: Ensure the database is properly configured and accessible
3. **Clean state**: Tests assume a clean application state for each test run

## Notes

- Some tests may require specific server configurations (e.g., multiple domains)
- Performance tests should be run under controlled network conditions
- Security tests are designed to verify that XSS vulnerabilities don't exist
- Accessibility tests provide basic checks but manual accessibility testing is also recommended
- Some advanced features (like password protection, expiration) may need server-side implementation

## Test Data

Tests use various test URLs:
- `https://duckduckgo.com/` - Primary test URL for redirection testing
- `https://www.google.com` - Secondary test URL
- `https://www.example.com` - Generic test URL
- Various invalid URLs for negative testing

Custom addresses and other test data are generated to avoid conflicts between test runs.
