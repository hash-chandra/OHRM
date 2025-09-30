const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const EmergencyContactsPage = require('../pages/EmergencyContactsPage');
const { VALID_CREDENTIALS, VALID_EMERGENCY_CONTACT, INVALID_PHONE_NUMBERS } = require('../config/testData');

describe('Emergency Contacts Tests - Smoke Test Suite', () => {
  let loginPage;
  let dashboardPage;
  let emergencyContactsPage;

  beforeAll(async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    emergencyContactsPage = new EmergencyContactsPage(page);
    
    // Login once for all tests
    await loginPage.navigate();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    await dashboardPage.navigateToMyInfo();
    await emergencyContactsPage.navigateToEmergencyContacts();
  });

  test('TC-EC01: Navigate to Emergency Contacts - Should load page successfully', async () => {
    // Verify URL contains emergency contacts path
    const currentUrl = await page.url();
    expect(currentUrl).toContain('pim/viewEmergencyContacts');
    
    // Verify Add button is visible
    const addButton = await page.isVisible('button:has-text("Add")');
    expect(addButton).toBe(true);
    
    // Verify contact list area exists
    const contactList = await page.isVisible('.oxd-table-body');
    expect(contactList).toBe(true);
  });

  test('TC-EC02: Add Valid Emergency Contact - Should save successfully', async () => {
    // Get initial contacts count
    const initialContacts = await emergencyContactsPage.getEmergencyContactsList();
    const initialCount = initialContacts.length;
    
    // Add new emergency contact
    await emergencyContactsPage.addEmergencyContact(VALID_EMERGENCY_CONTACT);
    await emergencyContactsPage.save();
    
    // Verify success message
    const successMessage = await emergencyContactsPage.getSuccessMessage();
    expect(successMessage).toContain('Successfully');
    
    // Verify contact appears in list
    const isContactAdded = await emergencyContactsPage.isContactInList(VALID_EMERGENCY_CONTACT.name);
    expect(isContactAdded).toBe(true);
    
    // Verify contact count increased
    const updatedContacts = await emergencyContactsPage.getEmergencyContactsList();
    expect(updatedContacts.length).toBe(initialCount + 1);
    
    // Verify all details are saved correctly
    const addedContact = updatedContacts.find(contact => 
      contact.name.includes(VALID_EMERGENCY_CONTACT.name)
    );
    expect(addedContact).toBeTruthy();
    expect(addedContact.relationship).toContain(VALID_EMERGENCY_CONTACT.relationship);
  });
});

describe('Emergency Contacts Tests - Regression Suite', () => {
  let loginPage;
  let dashboardPage;
  let emergencyContactsPage;

  beforeAll(async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    emergencyContactsPage = new EmergencyContactsPage(page);
    
    // Login once for all tests
    await loginPage.navigate();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await dashboardPage.isDashboardVisible();
    await dashboardPage.navigateToMyInfo();
    await emergencyContactsPage.navigateToEmergencyContacts();
  });

  test('TC-EC-R01: Missing Name Field - Should show validation error', async () => {
    // Try to add contact without name
    await emergencyContactsPage.addEmergencyContact({
      name: '',
      relationship: 'Friend',
      homePhone: '+1-555-111-2222',
      mobile: '+1-555-111-2223'
    });
    await emergencyContactsPage.save();
    
    // Verify error message for required name field
    const errorMessages = await emergencyContactsPage.getErrorMessages();
    expect(errorMessages.some(msg => msg.includes('Required'))).toBe(true);
    
    // Verify contact was not added
    const contacts = await emergencyContactsPage.getEmergencyContactsList();
    const hasEmptyNameContact = contacts.some(contact => !contact.name || contact.name.trim() === '');
    expect(hasEmptyNameContact).toBe(false);
  });

  test('TC-EC-R02: Missing Relationship Field - Should show validation error', async () => {
    // Try to add contact without relationship
    await emergencyContactsPage.addEmergencyContact({
      name: 'John Smith',
      relationship: '',
      homePhone: '+1-555-333-4444',
      mobile: '+1-555-333-4445'
    });
    await emergencyContactsPage.save();
    
    // Verify error message for required relationship field
    const errorMessages = await emergencyContactsPage.getErrorMessages();
    expect(errorMessages.some(msg => msg.includes('Required'))).toBe(true);
    
    // Verify contact was not added without relationship
    const isContactAdded = await emergencyContactsPage.isContactInList('John Smith');
    expect(isContactAdded).toBe(false);
  });

  test.each(INVALID_PHONE_NUMBERS)('TC-EC-R03: Invalid Phone Format - %s', async (invalidPhone) => {
    // Try to add contact with invalid phone
    await emergencyContactsPage.addEmergencyContact({
      name: 'Test Contact',
      relationship: 'Sibling',
      homePhone: invalidPhone,
      mobile: '+1-555-555-5555'
    });
    await emergencyContactsPage.save();
    
    // Check system behavior
    const errorMessages = await emergencyContactsPage.getErrorMessages();
    
    if (errorMessages.length > 0) {
      // System validates phone format
      expect(errorMessages.some(msg => 
        msg.includes('invalid') || 
        msg.includes('format') || 
        msg.includes('phone')
      )).toBe(true);
    } else {
      // If no error, verify contact was not added with invalid phone
      const contacts = await emergencyContactsPage.getEmergencyContactsList();
      const contactWithInvalidPhone = contacts.find(contact => 
        contact.name.includes('Test Contact') && 
        contact.homePhone === invalidPhone
      );
      expect(contactWithInvalidPhone).toBeFalsy();
    }
  });

  test('TC-EC-R04: Special Characters in Name - Should handle appropriately', async () => {
    // Try name with valid special characters (apostrophe, hyphen)
    const contactWithSpecialChars = {
      name: "O'Brien-Smith",
      relationship: 'Parent',
      homePhone: '+1-555-555-5555',
      mobile: '+1-555-555-5556'
    };
    
    await emergencyContactsPage.addEmergencyContact(contactWithSpecialChars);
    await emergencyContactsPage.save();
    
    // Check if valid special characters are accepted
    const errorMessages = await emergencyContactsPage.getErrorMessages();
    const successMessage = await emergencyContactsPage.getSuccessMessage();
    
    if (successMessage && !errorMessages.length) {
      // Valid special characters were accepted
      const isContactAdded = await emergencyContactsPage.isContactInList("O'Brien-Smith");
      expect(isContactAdded).toBe(true);
    } else if (errorMessages.length > 0) {
      // System doesn't allow special characters
      expect(errorMessages.some(msg => 
        msg.includes('invalid') || 
        msg.includes('characters')
      )).toBe(true);
    }
  });

  test('TC-EC-R05: Multiple Emergency Contacts - Should handle multiple additions', async () => {
    // Get initial count
    const initialContacts = await emergencyContactsPage.getEmergencyContactsList();
    const initialCount = initialContacts.length;
    
    // Add first contact
    await emergencyContactsPage.addEmergencyContact({
      name: 'First Contact',
      relationship: 'Parent',
      homePhone: '+1-555-111-1111',
      mobile: '+1-555-111-1112'
    });
    await emergencyContactsPage.save();
    
    // Wait and navigate back to add another
    await page.waitForTimeout(2000);
    await emergencyContactsPage.navigateToEmergencyContacts();
    
    // Add second contact
    await emergencyContactsPage.addEmergencyContact({
      name: 'Second Contact',
      relationship: 'Sibling',
      homePhone: '+1-555-222-2222',
      mobile: '+1-555-222-2223'
    });
    await emergencyContactsPage.save();
    
    // Verify both contacts were added
    await page.waitForTimeout(2000);
    const finalContacts = await emergencyContactsPage.getEmergencyContactsList();
    
    const firstContactExists = await emergencyContactsPage.isContactInList('First Contact');
    const secondContactExists = await emergencyContactsPage.isContactInList('Second Contact');
    
    expect(firstContactExists).toBe(true);
    expect(secondContactExists).toBe(true);
    expect(finalContacts.length).toBeGreaterThanOrEqual(initialCount + 2);
  });

  test('TC-EC-R06: Contact Data Persistence - Should persist after page refresh', async () => {
    // Add a contact
    const testContact = {
      name: 'Persistence Test',
      relationship: 'Friend',
      homePhone: '+1-555-999-9999',
      mobile: '+1-555-999-9998'
    };
    
    await emergencyContactsPage.addEmergencyContact(testContact);
    await emergencyContactsPage.save();
    
    // Verify contact was added
    let isContactAdded = await emergencyContactsPage.isContactInList(testContact.name);
    expect(isContactAdded).toBe(true);
    
    // Refresh page and verify persistence
    await page.reload();
    await emergencyContactsPage.navigateToEmergencyContacts();
    
    isContactAdded = await emergencyContactsPage.isContactInList(testContact.name);
    expect(isContactAdded).toBe(true);
  });

  test('TC-EC-R07: Required Fields Only - Should save with minimum required data', async () => {
    // Add contact with only required fields (name and relationship)
    await emergencyContactsPage.addEmergencyContact({
      name: 'Minimal Contact',
      relationship: 'Colleague',
      homePhone: '',
      mobile: ''
    });
    await emergencyContactsPage.save();
    
    // Check if contact can be saved with minimal data
    const errorMessages = await emergencyContactsPage.getErrorMessages();
    const successMessage = await emergencyContactsPage.getSuccessMessage();
    
    if (successMessage && !errorMessages.length) {
      // Contact saved with minimal data
      const isContactAdded = await emergencyContactsPage.isContactInList('Minimal Contact');
      expect(isContactAdded).toBe(true);
    } else {
      // Phone number might be required - check error message
      expect(errorMessages.some(msg => 
        msg.includes('Required') || 
        msg.includes('phone')
      )).toBe(true);
    }
  });
});