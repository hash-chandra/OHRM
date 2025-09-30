const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const ContactDetailsPage = require('../pages/ContactDetailsPage');
const { VALID_CREDENTIALS, VALID_ADDRESS, VALID_PHONE, INVALID_PHONE_NUMBERS, INVALID_ZIP_CODES } = require('../config/testData');

describe('Contact Details Tests - Smoke Test Suite', () => {
  let loginPage;
  let dashboardPage;
  let contactDetailsPage;

  beforeAll(async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    contactDetailsPage = new ContactDetailsPage(page);
    
    // Login once for all tests
    await loginPage.navigate();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    await dashboardPage.navigateToMyInfo();
    await contactDetailsPage.navigateToContactDetails();
  });

  test('TC-CD01: Navigate to Contact Details - Should load page successfully', async () => {
    // Verify URL contains contact details path
    const currentUrl = await page.url();
    expect(currentUrl).toContain('pim/contactDetails');
    
    // Verify form fields are visible
    const streetField = await page.isVisible('input[placeholder="Street 1"]');
    const phoneField = await page.isVisible('input[placeholder="Mobile"]');
    
    expect(streetField).toBe(true);
    expect(phoneField).toBe(true);
  });

  test('TC-CD02: Update Address with Valid Data - Should save successfully', async () => {
    // Store original address
    const originalAddress = await contactDetailsPage.getAddressData();
    
    // Update with valid address
    await contactDetailsPage.updateAddress(VALID_ADDRESS);
    await contactDetailsPage.save();
    
    // Verify success message
    const successMessage = await contactDetailsPage.getSuccessMessage();
    expect(successMessage).toContain('Successfully');
    
    // Verify address is updated
    const updatedAddress = await contactDetailsPage.getAddressData();
    expect(updatedAddress.street).toBe(VALID_ADDRESS.street);
    expect(updatedAddress.city).toBe(VALID_ADDRESS.city);
    expect(updatedAddress.state).toBe(VALID_ADDRESS.state);
    expect(updatedAddress.zip).toBe(VALID_ADDRESS.zip);
    
    // Verify data persists after page refresh
    await page.reload();
    await contactDetailsPage.navigateToContactDetails();
    
    const persistedAddress = await contactDetailsPage.getAddressData();
    expect(persistedAddress.street).toBe(VALID_ADDRESS.street);
    
    // Restore original address if it existed
    if (originalAddress.street) {
      await contactDetailsPage.updateAddress(originalAddress);
      await contactDetailsPage.save();
    }
  });

  test('TC-CD03: Update Phone Number with Valid Data - Should save successfully', async () => {
    // Store original phone
    const originalPhone = await contactDetailsPage.getPhoneNumber();
    
    // Update with valid phone
    await contactDetailsPage.updatePhoneNumber(VALID_PHONE);
    await contactDetailsPage.save();
    
    // Verify success message
    const successMessage = await contactDetailsPage.getSuccessMessage();
    expect(successMessage).toContain('Successfully');
    
    // Verify phone is updated
    const updatedPhone = await contactDetailsPage.getPhoneNumber();
    expect(updatedPhone).toBe(VALID_PHONE);
    
    // Verify data persists after page refresh
    await page.reload();
    await contactDetailsPage.navigateToContactDetails();
    
    const persistedPhone = await contactDetailsPage.getPhoneNumber();
    expect(persistedPhone).toBe(VALID_PHONE);
    
    // Restore original phone if it existed
    if (originalPhone) {
      await contactDetailsPage.updatePhoneNumber(originalPhone);
      await contactDetailsPage.save();
    }
  });
});

describe('Contact Details Tests - Regression Suite', () => {
  let loginPage;
  let dashboardPage;
  let contactDetailsPage;

  beforeAll(async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    contactDetailsPage = new ContactDetailsPage(page);
    
    // Login once for all tests
    await loginPage.navigate();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    await dashboardPage.navigateToMyInfo();
    await contactDetailsPage.navigateToContactDetails();
  });

  test('TC-CD-R01: Empty Street Address - Should handle validation', async () => {
    // Store original address
    const originalAddress = await contactDetailsPage.getAddressData();
    
    // Clear street address but fill other fields
    await contactDetailsPage.updateAddress({
      street: '',
      city: 'Test City',
      state: 'Test State',
      zip: '12345'
    });
    await contactDetailsPage.save();
    
    // Check if system handles empty street gracefully
    const errorMessages = await contactDetailsPage.getErrorMessages();
    const successMessage = await contactDetailsPage.getSuccessMessage();
    
    // System should either show error or accept empty street
    if (errorMessages.length > 0) {
      expect(errorMessages.some(msg => 
        msg.includes('Required') || 
        msg.includes('street')
      )).toBe(true);
    } else {
      // If accepted, verify it was saved
      expect(successMessage).toContain('Successfully');
    }
    
    // Restore original address
    if (originalAddress.street) {
      await contactDetailsPage.updateAddress(originalAddress);
      await contactDetailsPage.save();
    }
  });

  test.each(INVALID_ZIP_CODES)('TC-CD-R02: Invalid Zip Code Format - %s', async (invalidZip) => {
    // Store original address
    const originalAddress = await contactDetailsPage.getAddressData();
    
    // Try invalid zip code
    await contactDetailsPage.updateAddress({
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zip: invalidZip
    });
    await contactDetailsPage.save();
    
    // Verify error handling
    const errorMessages = await contactDetailsPage.getErrorMessages();
    
    if (errorMessages.length > 0) {
      // System validates zip code format
      expect(errorMessages.some(msg => 
        msg.includes('invalid') || 
        msg.includes('format') || 
        msg.includes('zip') ||
        msg.includes('postal')
      )).toBe(true);
    } else {
      // If no error, verify data was not saved with invalid format
      await page.reload();
      await contactDetailsPage.navigateToContactDetails();
      const currentAddress = await contactDetailsPage.getAddressData();
      expect(currentAddress.zip).not.toBe(invalidZip);
    }
    
    // Restore original address
    if (originalAddress.zip) {
      await contactDetailsPage.updateAddress(originalAddress);
      await contactDetailsPage.save();
    }
  });

  test.each(INVALID_PHONE_NUMBERS)('TC-CD-R03: Invalid Phone Number Format - %s', async (invalidPhone) => {
    // Store original phone
    const originalPhone = await contactDetailsPage.getPhoneNumber();
    
    // Try invalid phone number
    await contactDetailsPage.updatePhoneNumber(invalidPhone);
    await contactDetailsPage.save();
    
    // Verify error handling
    const errorMessages = await contactDetailsPage.getErrorMessages();
    
    if (errorMessages.length > 0) {
      // System validates phone format
      expect(errorMessages.some(msg => 
        msg.includes('invalid') || 
        msg.includes('format') || 
        msg.includes('phone') ||
        msg.includes('number')
      )).toBe(true);
    } else {
      // If no error, verify data was not saved with invalid format
      await page.reload();
      await contactDetailsPage.navigateToContactDetails();
      const currentPhone = await contactDetailsPage.getPhoneNumber();
      expect(currentPhone).not.toBe(invalidPhone);
    }
    
    // Restore original phone
    if (originalPhone) {
      await contactDetailsPage.updatePhoneNumber(originalPhone);
      await contactDetailsPage.save();
    }
  });

  test('TC-CD-R04: Phone with Special Characters - Should handle appropriately', async () => {
    // Store original phone
    const originalPhone = await contactDetailsPage.getPhoneNumber();
    
    // Try phone with special characters
    const phoneWithChars = '555-CALL-NOW';
    await contactDetailsPage.updatePhoneNumber(phoneWithChars);
    await contactDetailsPage.save();
    
    // Check system behavior
    const errorMessages = await contactDetailsPage.getErrorMessages();
    const successMessage = await contactDetailsPage.getSuccessMessage();
    
    if (errorMessages.length > 0) {
      // System rejects alphabetic characters in phone
      expect(errorMessages.some(msg => 
        msg.includes('invalid') || 
        msg.includes('format') || 
        msg.includes('numeric')
      )).toBe(true);
    } else if (successMessage) {
      // If accepted, verify final saved value is numeric format
      const savedPhone = await contactDetailsPage.getPhoneNumber();
      const isValidFormat = await contactDetailsPage.validatePhoneFormat(savedPhone);
      expect(isValidFormat).toBe(true);
    }
    
    // Restore original phone
    if (originalPhone) {
      await contactDetailsPage.updatePhoneNumber(originalPhone);
      await contactDetailsPage.save();
    }
  });

  test('TC-CD-R05: Maximum Length Fields - Should handle long input', async () => {
    // Store original address
    const originalAddress = await contactDetailsPage.getAddressData();
    
    // Try very long address (500+ characters)
    const longStreet = 'A'.repeat(501);
    await contactDetailsPage.updateAddress({
      street: longStreet,
      city: 'Test City',
      state: 'Test State',
      zip: '12345'
    });
    await contactDetailsPage.save();
    
    // Check system behavior
    const errorMessages = await contactDetailsPage.getErrorMessages();
    const successMessage = await contactDetailsPage.getSuccessMessage();
    
    if (errorMessages.length > 0) {
      // System validates maximum length
      expect(errorMessages.some(msg => 
        msg.includes('length') || 
        msg.includes('maximum') || 
        msg.includes('characters')
      )).toBe(true);
    } else if (successMessage) {
      // If accepted, verify data was truncated appropriately
      const savedAddress = await contactDetailsPage.getAddressData();
      expect(savedAddress.street.length).toBeLessThanOrEqual(500);
    }
    
    // Restore original address
    if (originalAddress.street) {
      await contactDetailsPage.updateAddress(originalAddress);
      await contactDetailsPage.save();
    }
  });
});