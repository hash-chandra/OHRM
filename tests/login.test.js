const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const { VALID_CREDENTIALS, INVALID_CREDENTIALS } = require('../config/testData');

describe('Login Tests', () => {
  let loginPage;
  let dashboardPage;

  beforeEach(async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  // Smoke Test Cases - Core functionality
  test('TC-01: Valid Login - Should authenticate user successfully', async () => {
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    
    // Verify dashboard is visible
    const isDashboardVisible = await dashboardPage.isDashboardVisible();
    expect(isDashboardVisible).toBe(true);
    
    // Verify URL contains dashboard
    const currentUrl = await dashboardPage.getCurrentUrl();
    expect(currentUrl).toContain('dashboard');
    
    // Verify user dropdown is visible (logout option available)
    const userName = await dashboardPage.getUserName();
    expect(userName).toBeTruthy();
  });

  test('TC-02: Invalid Username - Should display error message', async () => {
    await loginPage.login('InvalidUser123', VALID_CREDENTIALS.password);
    
    // Verify error message is displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
    
    // Verify user remains on login page
    const currentUrl = await page.url();
    expect(currentUrl).toContain('/auth/login');
  });

  test('TC-03: Invalid Password - Should display error message', async () => {
    await loginPage.login(VALID_CREDENTIALS.username, 'wrongpass');
    
    // Verify error message is displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
    
    // Verify user remains on login page
    const currentUrl = await page.url();
    expect(currentUrl).toContain('/auth/login');
  });

  test('TC-04: Empty Credentials - Should display required field validation', async () => {
    await loginPage.clearFields();
    await page.click('button[type="submit"]');
    
    // Verify required field messages
    const requiredMessages = await loginPage.getRequiredFieldMessages();
    expect(requiredMessages.length).toBeGreaterThan(0);
    expect(requiredMessages.some(msg => msg.includes('Required'))).toBe(true);
  });

  test('TC-07: Password Masking - Should hide password characters', async () => {
    const isPasswordMasked = await loginPage.isPasswordMasked();
    expect(isPasswordMasked).toBe(true);
  });

  // Regression Test Cases - Extended functionality
  test.each(INVALID_CREDENTIALS)('TC-R01: Invalid credentials test - $username', async (credentials) => {
    await loginPage.login(credentials.username, credentials.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
    
    const currentUrl = await page.url();
    expect(currentUrl).toContain('/auth/login');
  });

  test('TC-R02: Session Management - Logout functionality', async () => {
    // Login first
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    
    // Logout
    await dashboardPage.logout();
    
    // Verify redirect to login page
    const currentUrl = await page.url();
    expect(currentUrl).toContain('/auth/login');
    
    // Try to access dashboard directly after logout
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    
    // Should redirect back to login
    await page.waitForTimeout(2000);
    const finalUrl = await page.url();
    expect(finalUrl).toContain('/auth/login');
  });

  test('TC-R03: Browser Back Button After Logout', async () => {
    // Login
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    
    // Logout
    await dashboardPage.logout();
    
    // Use browser back button
    await page.goBack();
    
    // Should not access previous page, should redirect to login
    await page.waitForTimeout(2000);
    const currentUrl = await page.url();
    expect(currentUrl).toContain('/auth/login');
  });
});