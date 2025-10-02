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

  VALID_EMERGENCY_CONTACT_2: {
    name: 'John Smith',
    relationship: 'Brother',
    homePhone: '+1-555-111-2222',
    mobile: '+1-555-111-2223'
  },
  
  // Invalid test data
  INVALID_PHONE_NUMBERS: ['123', 'abcdefg', '555-CALL'],
  INVALID_PHONE_ALPHABETS: 'abcdefghij',
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
      MY_INFO_MENU: 'a[href="/web/index.php/pim/viewMyDetails"]',
      PERSONAL_DETAILS_TAB: 'text=Personal Details',
      CONTACT_DETAILS_TAB: 'text=Contact Details',
      EMERGENCY_CONTACTS_TAB: 'text=Emergency Contacts'
    },
    MY_INFO: {
      PAGE_HEADER: '.oxd-topbar-header-breadcrumb h6',
      SIDEBAR_MENU: '.orangehrm-tabs-wrapper'
    },
    PERSONAL_DETAILS: {
      FIRST_NAME: 'input[name="firstName"]',
      MIDDLE_NAME: 'input[name="middleName"]',
      LAST_NAME: 'input[name="lastName"]',
      EMPLOYEE_ID: '.oxd-input--active',
      SAVE_BUTTON: 'button[type="submit"]',
      SUCCESS_MESSAGE: '.oxd-toast-content--success',
      ERROR_MESSAGE: '.oxd-input-field-error-message'
    },
    CONTACT_DETAILS: {
      STREET1: '.oxd-input',
      STREET2: '.oxd-input',
      CITY: '.oxd-input',
      STATE: '.oxd-input',
      ZIP: '.oxd-input',
      COUNTRY: '.oxd-select-text-input',
      HOME_PHONE: '.oxd-input',
      MOBILE_PHONE: '.oxd-input',
      WORK_PHONE: '.oxd-input',
      WORK_EMAIL: '.oxd-input',
      OTHER_EMAIL: '.oxd-input',
      SAVE_BUTTON: 'button[type="submit"]',
      SUCCESS_MESSAGE: '.oxd-toast-content--success',
      ERROR_MESSAGE: '.oxd-input-field-error-message'
    },
    EMERGENCY_CONTACTS: {
      ADD_BUTTON: 'button:has-text("Add")',
      NAME_INPUT: '.oxd-input',
      RELATIONSHIP_INPUT: '.oxd-input',
      HOME_PHONE_INPUT: '.oxd-input',
      MOBILE_INPUT: '.oxd-input',
      WORK_PHONE_INPUT: '.oxd-input',
      SAVE_BUTTON: 'button[type="submit"]',
      CANCEL_BUTTON: 'button:has-text("Cancel")',
      SUCCESS_MESSAGE: '.oxd-toast-content--success',
      ERROR_MESSAGE: '.oxd-input-field-error-message',
      CONTACT_LIST: '.oxd-table-body',
      CONTACT_ROW: '.oxd-table-row',
      CONTACT_CELL: '.oxd-table-cell',
      DELETE_BUTTON: 'button.oxd-icon-button:has(i.bi-trash)',
      CONFIRM_DELETE_BUTTON: 'button.oxd-button--label-danger',
      NO_RECORDS_FOUND: '.oxd-table-card >> text=No Records Found'
    }
  }
};