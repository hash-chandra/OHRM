const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const MyInfoPage = require('../pages/MyInfoPage');
const PersonalDetailsPage = require('../pages/PersonalDetailsPage');
const { VALID_CREDENTIALS } = require('../config/testData');

describe('Personal Details Tests', () => {
  let loginPage;
  let dashboardPage;
  let myInfoPage;
  let personalDetailsPage;
  let context;
  let page;

  beforeEach(async () => {
    // Create a fresh browser context and page for each test
    context = await global.browser.newContext({ 
      viewport: { width: 1920, height: 1080 }, 
      ignoreHTTPSErrors: true 
    });
    page = await context.newPage();
    
    // Initialize all page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    myInfoPage = new MyInfoPage(page);
    personalDetailsPage = new PersonalDetailsPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
  });

  afterEach(async () => {
    if (page) await page.close();
    if (context) await context.close();
  });

  // TC-04: My Info -> Navigate to Personal Details section
  test('TC-04: Navigate to Personal Details section - Should navigate to My Info page', async () => {
    // Navigate to My Info
    await myInfoPage.navigateToMyInfo();
    
    // Verify My Info page is visible
    const isMyInfoVisible = await myInfoPage.isMyInfoPageVisible();
    expect(isMyInfoVisible).toBe(true);
    
    // Verify URL contains pim/view
    const currentUrl = await myInfoPage.getCurrentUrl();
    expect(currentUrl).toContain('pim/view');
  });

  // TC-05: My Info -> Validate First/Last Name fields
  test('TC-05: Validate First/Last Name fields - Should check if fields are present', async () => {
    // Navigate to My Info
    await myInfoPage.navigateToMyInfo();
    await myInfoPage.navigateToPersonalDetails();
    
    // Check if First Name field is present
    const isFirstNamePresent = await personalDetailsPage.isFirstNameFieldPresent();
    expect(isFirstNamePresent).toBe(true);
    
    // Check if Last Name field is present
    const isLastNamePresent = await personalDetailsPage.isLastNameFieldPresent();
    expect(isLastNamePresent).toBe(true);
    
    // Verify fields have values
    const firstNameValue = await personalDetailsPage.getFirstNameValue();
    const lastNameValue = await personalDetailsPage.getLastNameValue();
    
    expect(firstNameValue).toBeTruthy();
    expect(lastNameValue).toBeTruthy();
  });
});
