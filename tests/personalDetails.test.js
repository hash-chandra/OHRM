const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const PersonalDetailsPage = require('../pages/PersonalDetailsPage');
const { VALID_CREDENTIALS } = require('../config/testData');

describe('Personal Details Tests - Smoke Test Suite', () => {
  let loginPage;
  let dashboardPage;
  let personalDetailsPage;

  beforeAll(async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    personalDetailsPage = new PersonalDetailsPage(page);
    
    // Login once for all tests
    await loginPage.navigate();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    await dashboardPage.navigateToMyInfo();
    await personalDetailsPage.navigateToPersonalDetails();
  });

  test('TC-PD01: Validate First Name Field - Should display existing data', async () => {
    const firstName = await personalDetailsPage.getFirstName();
    
    // Verify field contains data
    expect(firstName).toBeTruthy();
    expect(firstName.length).toBeGreaterThan(0);
    
    // Verify field is editable
    const isEditable = await personalDetailsPage.isFieldEditable('input[name="firstName"]');
    expect(isEditable).toBe(true);
    
    // Verify data format (only alphabetic characters)
    const isValidFormat = await personalDetailsPage.validateNameFormat(firstName);
    expect(isValidFormat).toBe(true);
  });

  test('TC-PD02: Validate Last Name Field - Should display existing data', async () => {
    const lastName = await personalDetailsPage.getLastName();
    
    // Verify field contains data
    expect(lastName).toBeTruthy();
    expect(lastName.length).toBeGreaterThan(0);
    
    // Verify field is editable
    const isEditable = await personalDetailsPage.isFieldEditable('input[name="lastName"]');
    expect(isEditable).toBe(true);
    
    // Verify data format (only alphabetic characters)
    const isValidFormat = await personalDetailsPage.validateNameFormat(lastName);
    expect(isValidFormat).toBe(true);
  });

  test('TC-PD03: Empty First Name Validation - Should show required error', async () => {
    // Store original first name
    const originalFirstName = await personalDetailsPage.getFirstName();
    
    // Clear first name and try to save
    await personalDetailsPage.clearFirstName();
    await personalDetailsPage.save();
    
    // Verify error message appears
    const errorMessages = await personalDetailsPage.getErrorMessages();
    expect(errorMessages.some(msg => msg.includes('Required'))).toBe(true);
    
    // Restore original first name
    await personalDetailsPage.setFirstName(originalFirstName);
    await personalDetailsPage.save();
  });

  test('TC-PD04: Special Characters in Name - Should validate input', async () => {
    // Store original names
    const originalFirstName = await personalDetailsPage.getFirstName();
    
    // Try to enter special characters
    await personalDetailsPage.setFirstName('John@123');
    await personalDetailsPage.save();
    
    // Check if error message appears or if special characters are rejected
    const errorMessages = await personalDetailsPage.getErrorMessages();
    const successMessage = await personalDetailsPage.getSuccessMessage();
    
    if (errorMessages.length > 0) {
      // System validates and rejects special characters
      expect(errorMessages.some(msg => 
        msg.includes('invalid') || 
        msg.includes('format') || 
        msg.includes('characters')
      )).toBe(true);
    } else {
      // If no error, verify that data was not saved with special characters
      await page.reload();
      await personalDetailsPage.navigateToPersonalDetails();
      const currentFirstName = await personalDetailsPage.getFirstName();
      expect(currentFirstName).not.toBe('John@123');
    }
    
    // Restore original first name
    await personalDetailsPage.setFirstName(originalFirstName);
    await personalDetailsPage.save();
  });
});

describe('Personal Details Tests - Regression Suite', () => {
  let loginPage;
  let dashboardPage;
  let personalDetailsPage;

  beforeAll(async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    personalDetailsPage = new PersonalDetailsPage(page);
    
    // Login once for all tests
    await loginPage.navigate();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    await dashboardPage.navigateToMyInfo();
    await personalDetailsPage.navigateToPersonalDetails();
  });

  test('TC-PD-R01: Valid Name Update - Should save successfully', async () => {
    // Store original names
    const originalFirstName = await personalDetailsPage.getFirstName();
    const originalLastName = await personalDetailsPage.getLastName();
    
    // Update with valid names
    await personalDetailsPage.setFirstName('TestFirst');
    await personalDetailsPage.setLastName('TestLast');
    await personalDetailsPage.save();
    
    // Verify success message
    const successMessage = await personalDetailsPage.getSuccessMessage();
    expect(successMessage).toContain('Successfully');
    
    // Verify data persistence after page reload
    await page.reload();
    await personalDetailsPage.navigateToPersonalDetails();
    
    const updatedFirstName = await personalDetailsPage.getFirstName();
    const updatedLastName = await personalDetailsPage.getLastName();
    
    expect(updatedFirstName).toBe('TestFirst');
    expect(updatedLastName).toBe('TestLast');
    
    // Restore original names
    await personalDetailsPage.setFirstName(originalFirstName);
    await personalDetailsPage.setLastName(originalLastName);
    await personalDetailsPage.save();
  });

  test('TC-PD-R02: Maximum Length Validation - Should handle long names', async () => {
    // Store original first name
    const originalFirstName = await personalDetailsPage.getFirstName();
    
    // Try entering very long name (100+ characters)
    const longName = 'A'.repeat(101);
    await personalDetailsPage.setFirstName(longName);
    await personalDetailsPage.save();
    
    // Check system behavior - either truncates or shows error
    const errorMessages = await personalDetailsPage.getErrorMessages();
    const successMessage = await personalDetailsPage.getSuccessMessage();
    
    if (errorMessages.length > 0) {
      // System shows validation error for max length
      expect(errorMessages.some(msg => 
        msg.includes('length') || 
        msg.includes('maximum') || 
        msg.includes('characters')
      )).toBe(true);
    } else if (successMessage) {
      // System accepts but may truncate - verify saved data
      await page.reload();
      await personalDetailsPage.navigateToPersonalDetails();
      const savedName = await personalDetailsPage.getFirstName();
      expect(savedName.length).toBeLessThanOrEqual(100);
    }
    
    // Restore original first name
    await personalDetailsPage.setFirstName(originalFirstName);
    await personalDetailsPage.save();
  });

  test('TC-PD-R03: Empty Last Name Validation - Should show required error', async () => {
    // Store original last name
    const originalLastName = await personalDetailsPage.getLastName();
    
    // Clear last name and try to save
    await personalDetailsPage.clearLastName();
    await personalDetailsPage.save();
    
    // Verify error message appears
    const errorMessages = await personalDetailsPage.getErrorMessages();
    expect(errorMessages.some(msg => msg.includes('Required'))).toBe(true);
    
    // Restore original last name
    await personalDetailsPage.setLastName(originalLastName);
    await personalDetailsPage.save();
  });
});