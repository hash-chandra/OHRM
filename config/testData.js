module.exports = {
  // Application URLs
  BASE_URL: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
  DASHBOARD_URL: 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index',
  
  // Test Credentials
  VALID_CREDENTIALS: {
    username: 'Admin',
    password: 'admin123'
  },
  
  // Invalid test data
  INVALID_CREDENTIALS: [
    { username: 'InvalidUser', password: 'admin123' },
    { username: 'Admin', password: 'wrongpass' },
    { username: '', password: '' }
  ],
  
  // Valid test data
  VALID_ADDRESS: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  },
  
  VALID_PHONE: '+1-555-123-4567',
  
  VALID_EMERGENCY_CONTACT: {
    name: 'Jane Doe',
    relationship: 'Spouse',
    homePhone: '+1-555-987-6543',
    mobile: '+1-555-987-6544'
  },
  
  // Invalid test data
  INVALID_PHONE_NUMBERS: ['123', 'abcdefg', '555-CALL'],
  INVALID_ZIP_CODES: ['ABCDE', '123', '1234567890'],
  
  // Timeouts
  DEFAULT_TIMEOUT: 10000,
  SHORT_TIMEOUT: 5000,
  LONG_TIMEOUT: 30000,
  
  // Selectors
  SELECTORS: {
    LOGIN: {
      USERNAME_INPUT: 'input[name="username"]',
      PASSWORD_INPUT: 'input[name="password"]',
      LOGIN_BUTTON: 'button[type="submit"]',
      ERROR_MESSAGE: '.oxd-alert-content-text',
      REQUIRED_MESSAGE: '.oxd-input-field-error-message'
    },
    DASHBOARD: {
      USER_DROPDOWN: '.oxd-userdropdown-tab',
      LOGOUT_OPTION: 'a[href="/web/index.php/auth/logout"]',
      DASHBOARD_HEADER: '.oxd-topbar-header-breadcrumb h6'
    },
    NAVIGATION: {
      MY_INFO_MENU: 'text=My Info',
      PERSONAL_DETAILS_TAB: 'text=Personal Details',
      CONTACT_DETAILS_TAB: 'text=Contact Details',
      EMERGENCY_CONTACTS_TAB: 'text=Emergency Contacts'
    },
    PERSONAL_DETAILS: {
      FIRST_NAME: 'input[name="firstName"]',
      LAST_NAME: 'input[name="lastName"]',
      SAVE_BUTTON: 'button[type="submit"]',
      SUCCESS_MESSAGE: '.oxd-toast-content-text'
    },
    CONTACT_DETAILS: {
      STREET1: 'input[placeholder="Street 1"]',
      STREET2: 'input[placeholder="Street 2"]',
      CITY: 'input[placeholder="City"]',
      STATE: 'input[placeholder="State/Province"]',
      ZIP: 'input[placeholder="Zip/Postal Code"]',
      COUNTRY: '.oxd-select-text-input',
      HOME_PHONE: 'input[placeholder="Home"]',
      MOBILE_PHONE: 'input[placeholder="Mobile"]',
      WORK_PHONE: 'input[placeholder="Work"]',
      SAVE_BUTTON: 'button[type="submit"]'
    },
    EMERGENCY_CONTACTS: {
      ADD_BUTTON: 'button:has-text("Add")',
      NAME_INPUT: 'input[placeholder="Name"]',
      RELATIONSHIP_INPUT: 'input[placeholder="Relationship"]',
      HOME_PHONE_INPUT: 'input[placeholder="Home Telephone"]',
      MOBILE_INPUT: 'input[placeholder="Mobile"]',
      SAVE_BUTTON: 'button[type="submit"]',
      CONTACT_LIST: '.oxd-table-body'
    }
  }
};