const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const { VALID_CREDENTIALS, INVALID_CREDENTIALS } = require('../config/testData');
const TestUtils = require('../utils/testUtils');

describe('Login Tests', () => {
  let loginPage;
  let dashboardPage;
  let browser;
  let page;

  beforeEach(async () => {
    // Create a new browser and page for each test
    const playwright = require('playwright');
    browser = await playwright.chromium.launch();
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  afterEach(async () => {
    // Close page and browser after each test
    if (page && page.close) {
      try {
        await page.close();
      } catch (e) {
        // Ignore errors on close
      }
    }
    if (browser && browser.close) {
      try {
        await browser.close();
      } catch (e) {
        // Ignore errors on close
      }
    }
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
  // Wait for validation messages to appear using TestUtils
  await TestUtils.waitForSelector(page, '.oxd-input-group__message', 2000);
  // Verify required field messages
  const requiredMessages = await loginPage.getRequiredFieldMessages();
  expect(requiredMessages.length).toBeGreaterThan(0);
  expect(requiredMessages.some(msg => msg.includes('Required'))).toBe(true);
  });
});