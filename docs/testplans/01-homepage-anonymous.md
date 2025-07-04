# Homepage Test Plan - Anonymous User

## Overview
This test plan covers the functionality of the Kutt URL shortener homepage for anonymous (not logged in) users. Based on analysis conducted on July 3, 2025.

## Test Environment
- **Application URL**: http://localhost:3000/
- **User Type**: Anonymous (not logged in)
- **Browser**: All major browsers (Chrome, Firefox, Safari, Edge)

---

## Test Cases

### TC-001: Homepage Load and Display
**Test Name**: Verify Homepage Loads Successfully

**Objective/Description**: Ensure the homepage loads correctly and displays all required elements for anonymous users.

**Preconditions**: 
- Server is running on localhost:3000
- User is not logged in
- Browser has no cached data

**Test Data**: None required

**Test Steps**:
1. Navigate to http://localhost:3000/
2. Wait for page to fully load
3. Verify page title displays "Kutt | Free modern URL shortener"
4. Verify main heading "Cut your links shorter." is visible
5. Verify URL input field is present with placeholder "Paste your long URL"
6. Verify submit button is present
7. Verify "Show advanced options" checkbox is present
8. Verify header contains logo and navigation links
9. Verify footer contains powered by link and terms of service

**Expected Result**: 
- Page loads successfully within 3 seconds
- All UI elements are visible and properly positioned
- No JavaScript errors in console

---

### TC-002: URL Shortening Basic Functionality
**Test Name**: Create Short URL with Valid Long URL

**Objective/Description**: Verify that anonymous users can successfully shorten a valid URL using basic functionality.

**Preconditions**: 
- Homepage is loaded
- Advanced options are collapsed (default state)

**Test Data**: 
- Valid URL: `https://www.duckduckgo.com`

**Test Steps**:
1. Click on the URL input field
2. Enter "https://duckduckgo.com/"
3. Click the submit button (arrow icon)
4. Wait for response
5. Go to the short URL and verify it redirects to the long URL (https://duckduckgo.com/)

**Expected Result**: 
- Short URL is generated (format: localhost:3000/[random-string])
- Short URL is displayed prominently at the top
- Copy button appears next to the short URL
- Form remains available for creating additional URLs
- No error messages are displayed

---

### TC-003: URL Shortening with Invalid URL
**Test Name**: Attempt URL Shortening with Invalid URL

**Objective/Description**: Verify proper error handling when user submits an invalid URL.

**Preconditions**: 
- Homepage is loaded

**Test Data**: 
- Invalid URLs: `invalid-url`, `not-a-url`, `ftp://example.com`, `javascript:alert('test')`

**Test Steps**:
1. Enter invalid URL in the input field
2. Click submit button
3. Observe error handling

**Expected Result**: 
- Appropriate error message is displayed
- Form remains in error state
- User can correct the input and retry
- No short URL is generated

---

### TC-004: URL Shortening with Empty Input
**Test Name**: Submit Form with Empty URL Field

**Objective/Description**: Verify form validation when URL field is empty.

**Preconditions**: 
- Homepage is loaded

**Test Data**: 
- Empty string

**Test Steps**:
1. Leave URL input field empty
2. Click submit button
3. Observe validation behavior

**Expected Result**: 
- Validation error message appears
- Form indicates required field
- Submission is prevented
- Focus returns to URL input field

---

### TC-005: Advanced Options Toggle
**Test Name**: Show/Hide Advanced Options

**Objective/Description**: Verify the advanced options checkbox properly toggles additional form fields.

**Preconditions**: 
- Homepage is loaded
- Advanced options are hidden (default state)

**Test Data**: None required

**Test Steps**:
1. Verify advanced options section is hidden
2. Click "Show advanced options" checkbox
3. Verify advanced options section becomes visible
4. Click checkbox again to uncheck
5. Verify advanced options section is hidden again

**Expected Result**: 
- Advanced options section toggles visibility correctly
- Checkbox state reflects the visibility of advanced options
- Animation/transition is smooth (if implemented)
- Form layout adjusts appropriately

---

### TC-006: Advanced Options - Custom URL
**Test Name**: Create Short URL with Custom Address

**Objective/Description**: Verify users can create custom short URLs using advanced options.

**Preconditions**: 
- Homepage is loaded
- Advanced options are expanded

**Test Data**: 
- Target URL: `https://www.google.com`
- Custom URL: `my-custom-link`

**Test Steps**:
1. Expand advanced options
2. Enter target URL
3. Enter custom address in the custom URL field
4. Submit form

**Expected Result**: 
- Short URL uses custom address: localhost:3000/my-custom-link
- Link functions correctly
- Success message or display shows custom URL

---

### TC-007: Advanced Options - Custom URL Conflict
**Test Name**: Handle Custom URL Already in Use

**Objective/Description**: Verify proper error handling when custom URL is already taken.

**Preconditions**: 
- Homepage is loaded
- Advanced options are expanded
- A custom URL "test-link" already exists

**Test Data**: 
- Target URL: `https://www.example.com`
- Custom URL: `test-link` (already exists)

**Test Steps**:
1. Expand advanced options
2. Enter target URL
3. Enter existing custom address
4. Submit form

**Expected Result**: 
- Error message: "Custom URL is already in use."
- Form remains in error state
- User can modify custom URL and retry
- No duplicate short URL is created

---

### TC-008: Advanced Options - Password Protection
**Test Name**: Create Password-Protected Short URL

**Objective/Description**: Verify users can create password-protected short URLs.

**Preconditions**: 
- Homepage is loaded
- Advanced options are expanded

**Test Data**: 
- Target URL: `https://www.example.com`
- Password: `test123`

**Test Steps**:
1. Expand advanced options
2. Enter target URL
3. Enter password in password field
4. Submit form
5. Access the created short URL
6. Verify password prompt appears

**Expected Result**: 
- Short URL is created successfully
- When accessed, password prompt is displayed
- Correct password grants access to target URL
- Incorrect password shows error message

---

### TC-009: Advanced Options - Expiration
**Test Name**: Create Short URL with Expiration

**Objective/Description**: Verify users can set expiration time for short URLs.

**Preconditions**: 
- Homepage is loaded
- Advanced options are expanded

**Test Data**: 
- Target URL: `https://www.example.com`
- Expiration: `2 minutes`

**Test Steps**:
1. Expand advanced options
2. Enter target URL
3. Enter "2 minutes" in expire_in field
4. Submit form
5. Wait for expiration time
6. Try to access the short URL after expiration

**Expected Result**: 
- Short URL is created successfully
- URL works before expiration
- URL shows appropriate error/expired message after expiration
- Expiration time is parsed correctly (supports minutes/hours/days)

---

### TC-010: Advanced Options - Description
**Test Name**: Add Description to Short URL

**Objective/Description**: Verify users can add descriptions to short URLs.

**Preconditions**: 
- Homepage is loaded
- Advanced options are expanded

**Test Data**: 
- Target URL: `https://www.example.com`
- Description: `Test link for documentation`

**Test Steps**:
1. Expand advanced options
2. Enter target URL
3. Enter description
4. Submit form

**Expected Result**: 
- Short URL is created successfully
- Description is stored with the link
- Description can be viewed (if applicable for anonymous users)

---

### TC-011: Advanced Options - Domain Selection
**Test Name**: Select Different Domain for Short URL

**Objective/Description**: Verify domain dropdown functionality in advanced options.

**Preconditions**: 
- Homepage is loaded
- Advanced options are expanded
- Multiple domains are configured

**Test Data**: 
- Target URL: `https://www.example.com`

**Test Steps**:
1. Expand advanced options
2. Click domain dropdown
3. Verify available domains are listed
4. Select a domain (if multiple available)
5. Verify custom URL prefix updates
6. Submit form with selected domain

**Expected Result**: 
- Dropdown shows available domains
- Custom URL prefix updates when domain changes
- Short URL uses selected domain
- Default domain is localhost:3000

---

### TC-012: Copy Short URL Functionality
**Test Name**: Copy Generated Short URL to Clipboard

**Objective/Description**: Verify users can copy generated short URLs to clipboard.

**Preconditions**: 
- Short URL has been generated and is displayed

**Test Data**: 
- Previously generated short URL

**Test Steps**:
1. Generate a short URL
2. Click the copy button next to the short URL
3. Verify visual feedback (button state change)
4. Paste clipboard content in another application
5. Click on the short URL text itself (alternative copy method)

**Expected Result**: 
- Copy button shows visual feedback when clicked
- Short URL is copied to clipboard accurately
- Clicking on URL text also copies to clipboard
- Success indicator appears (check icon)

---

### TC-013: Navigation - Login/Sign Up
**Test Name**: Navigate to Login/Sign Up Page

**Objective/Description**: Verify navigation to authentication page works correctly.

**Preconditions**: 
- Homepage is loaded
- User is anonymous

**Test Data**: None required

**Test Steps**:
1. Locate "Log in / Sign up" button in navigation
2. Click the button
3. Verify navigation to login page

**Expected Result**: 
- Redirected to /login URL
- Login page loads correctly
- Page title changes to "Kutt | Log in or sign up"
- Email and password fields are present
- Login button is available

---

### TC-014: Navigation - Terms of Service
**Test Name**: Navigate to Terms of Service Page

**Objective/Description**: Verify terms of service link works correctly.

**Preconditions**: 
- Homepage is loaded

**Test Data**: None required

**Test Steps**:
1. Scroll to footer
2. Click "Terms of Service" link
3. Verify navigation to terms page

**Expected Result**: 
- Redirected to /terms URL
- Terms page loads correctly
- Page title changes to "Kutt | Terms of Service"
- Terms content is displayed
- Navigation back to homepage is available

---

### TC-015: Navigation - GitHub Link
**Test Name**: Verify GitHub Repository Link

**Objective/Description**: Verify GitHub link opens repository in new tab.

**Preconditions**: 
- Homepage is loaded

**Test Data**: None required

**Test Steps**:
1. Locate GitHub link in header
2. Right-click and verify link URL
3. Click GitHub link
4. Verify new tab opens with GitHub repository

**Expected Result**: 
- Link points to https://github.com/thedevs-network/kutt
- Opens in new tab/window
- Original page remains open
- GitHub repository page loads correctly

---

### TC-016: Navigation - Logo Click
**Test Name**: Logo Navigation to Homepage

**Objective/Description**: Verify clicking logo navigates to homepage.

**Preconditions**: 
- User is on any page of the application

**Test Data**: None required

**Test Steps**:
1. Navigate to /terms or /login page
2. Click on the Kutt logo in header
3. Verify navigation back to homepage

**Expected Result**: 
- Redirected to homepage (/)
- Homepage loads correctly
- URL shortener form is available

---

### TC-017: Responsive Design - Mobile View
**Test Name**: Verify Mobile Responsiveness

**Objective/Description**: Ensure homepage displays correctly on mobile devices.

**Preconditions**: 
- Homepage is loaded

**Test Data**: 
- Various mobile viewport sizes (320px, 375px, 414px width)

**Test Steps**:
1. Resize browser to mobile viewport
2. Verify layout adapts appropriately
3. Test form functionality on mobile
4. Verify touch targets are adequately sized
5. Test navigation menu on mobile

**Expected Result**: 
- Layout is responsive and readable
- Form elements are properly sized for touch
- Navigation remains accessible
- No horizontal scrolling required
- Text remains legible

---

### TC-018: Responsive Design - Tablet View
**Test Name**: Verify Tablet Responsiveness

**Objective/Description**: Ensure homepage displays correctly on tablet devices.

**Preconditions**: 
- Homepage is loaded

**Test Data**: 
- Tablet viewport sizes (768px, 1024px width)

**Test Steps**:
1. Resize browser to tablet viewport
2. Verify layout adapts appropriately
3. Test form functionality
4. Verify spacing and typography

**Expected Result**: 
- Layout utilizes tablet space effectively
- Form remains functional and well-proportioned
- Navigation is appropriate for tablet interaction
- Content remains readable and accessible

---

### TC-019: Accessibility - Keyboard Navigation
**Test Name**: Verify Keyboard Navigation Support

**Objective/Description**: Ensure all interactive elements are accessible via keyboard.

**Preconditions**: 
- Homepage is loaded

**Test Data**: None required

**Test Steps**:
1. Use Tab key to navigate through interactive elements
2. Verify focus indicators are visible
3. Test form submission using Enter key
4. Test checkbox toggle using Space key
5. Verify logical tab order

**Expected Result**: 
- All interactive elements are reachable via keyboard
- Focus indicators are clear and visible
- Tab order is logical and intuitive
- Form can be submitted without mouse
- Checkbox can be toggled with keyboard

---

### TC-020: Accessibility - Screen Reader Compatibility
**Test Name**: Verify Screen Reader Accessibility

**Objective/Description**: Ensure homepage is compatible with screen readers.

**Preconditions**: 
- Homepage is loaded
- Screen reader is available

**Test Data**: None required

**Test Steps**:
1. Navigate page using screen reader
2. Verify form labels are properly announced
3. Test error message accessibility
4. Verify button descriptions are clear
5. Check heading structure

**Expected Result**: 
- All form elements have proper labels
- Error messages are announced
- Button purposes are clear
- Heading structure is logical
- No accessibility violations detected

---

### TC-021: Performance - Page Load Time
**Test Name**: Verify Page Load Performance

**Objective/Description**: Ensure homepage loads within acceptable time limits.

**Preconditions**: 
- Normal network conditions

**Test Data**: None required

**Test Steps**:
1. Clear browser cache
2. Navigate to homepage
3. Measure time to interactive
4. Verify all resources load correctly
5. Check for optimization opportunities

**Expected Result**: 
- Page loads within 3 seconds on normal connection
- Time to interactive is under 2 seconds
- No render-blocking resources
- Images are optimized
- CSS and JS are minified

---

### TC-022: Cross-Browser Compatibility
**Test Name**: Verify Cross-Browser Functionality

**Objective/Description**: Ensure homepage works across major browsers.

**Preconditions**: 
- Access to multiple browsers

**Test Data**: 
- Target browsers: Chrome, Firefox, Safari, Edge

**Test Steps**:
1. Test basic functionality in each browser
2. Verify visual consistency
3. Test form submission
4. Verify JavaScript functionality
5. Check for browser-specific issues

**Expected Result**: 
- Consistent functionality across all browsers
- Visual appearance is similar
- No browser-specific errors
- Form submission works in all browsers
- JavaScript features function properly

---

### TC-023: Error Handling - Network Issues
**Test Name**: Handle Network Connectivity Issues

**Objective/Description**: Verify graceful handling of network problems.

**Preconditions**: 
- Homepage is loaded
- Ability to simulate network issues

**Test Data**: 
- Valid URL: `https://www.example.com`

**Test Steps**:
1. Disconnect network/block requests
2. Attempt to submit URL shortening form
3. Reconnect network
4. Retry submission
5. Verify error messaging

**Expected Result**: 
- Appropriate error message for network issues
- Form doesn't break on network failure
- Retry functionality works after reconnection
- User is informed about connectivity issues
- No data loss occurs

---

### TC-024: Security - XSS Prevention
**Test Name**: Verify XSS Attack Prevention

**Objective/Description**: Ensure form inputs are properly sanitized to prevent XSS attacks.

**Preconditions**: 
- Homepage is loaded

**Test Data**: 
- XSS payloads: `<script>alert('xss')</script>`, `javascript:alert('xss')`, `<img src=x onerror=alert('xss')>`

**Test Steps**:
1. Enter XSS payload in URL field
2. Submit form
3. Enter XSS payload in custom URL field
4. Enter XSS payload in description field
5. Verify no script execution occurs

**Expected Result**: 
- XSS payloads are properly sanitized
- No script execution occurs
- Error messages are safely displayed
- Input validation prevents malicious code
- Application remains secure

---

### TC-025: URL Redirection
**Test Name**: Verify Short URL Redirection Works

**Objective/Description**: Ensure generated short URLs properly redirect to target URLs.

**Preconditions**: 
- Short URL has been generated

**Test Data**: 
- Target URL: `https://www.google.com`
- Generated short URL from previous test

**Test Steps**:
1. Generate short URL for target
2. Copy the generated short URL
3. Open new browser tab/window
4. Navigate to the short URL
5. Verify redirection to target URL

**Expected Result**: 
- Short URL redirects to correct target URL
- Redirection happens quickly (under 1 second)
- Target page loads correctly
- URL in address bar changes to target URL
- No intermediate error pages

---

## Test Summary

**Total Test Cases**: 25

**Categories**:
- Basic Functionality: 5 tests
- Advanced Options: 6 tests
- Navigation: 4 tests
- Responsive Design: 2 tests
- Accessibility: 2 tests
- Performance: 1 test
- Cross-Browser: 1 test
- Error Handling: 1 test
- Security: 1 test
- URL Redirection: 1 test

**Priority Levels**:
- **High Priority** (Critical functionality): TC-001, TC-002, TC-003, TC-025
- **Medium Priority** (Important features): TC-004 through TC-012, TC-013, TC-014
- **Low Priority** (Quality assurance): TC-015 through TC-024

## Notes

- All tests should be executed in the order listed for dependency management
- Some tests require specific server configurations (multiple domains, etc.)
- Performance tests should be conducted under controlled network conditions
- Security tests should be performed in a safe testing environment
- Accessibility tests require appropriate testing tools and expertise

## Test Environment Requirements

- Local development server running on localhost:3000
- Modern web browsers (Chrome 90+, Firefox 85+, Safari 14+, Edge 90+)
- Network connectivity for testing external URLs
- Screen reader software for accessibility testing
- Developer tools for performance measurement
