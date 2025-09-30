# OrangeHRM Test Automation

This project contains automated tests for the OrangeHRM demo application using JavaScript, Playwright, and Jest framework.

## Project Structure

```
├── config/
│   ├── jest.setup.js          # Jest configuration and global setup
│   └── testData.js             # Test data and selectors
├── pages/
│   ├── LoginPage.js            # Login page object model
│   ├── DashboardPage.js        # Dashboard page object model
│   ├── PersonalDetailsPage.js  # Personal details page object model
│   ├── ContactDetailsPage.js   # Contact details page object model
│   └── EmergencyContactsPage.js # Emergency contacts page object model
├── tests/
│   ├── login.test.js           # Login functionality tests
│   ├── personalDetails.test.js # Personal details tests
│   ├── contactDetails.test.js  # Contact details tests
│   ├── emergencyContacts.test.js # Emergency contacts tests
│   ├── nonFunctional.test.js   # Cross-browser, performance, responsive tests
│   └── smokeTest.test.js       # Smoke test suite
├── utils/
│   └── testUtils.js            # Utility functions for tests
├── reports/
│   ├── screenshots/            # Test failure screenshots
│   └── videos/                 # Test execution videos
├── package.json                # Project dependencies and scripts
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run install-browsers
   ```

4. Copy environment variables template:
   ```bash
   cp .env.example .env
   ```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example` and configure:

- `BASE_URL`: Application URL (default: OrangeHRM demo)
- `TEST_USERNAME`: Valid username (default: Admin)
- `TEST_PASSWORD`: Valid password (default: admin123)
- `BROWSER`: Browser to use (chromium, firefox, webkit)
- `HEADED`: Run in headed mode (true/false)

### Test Data

Test data is configured in `config/testData.js` including:
- Valid and invalid credentials
- Test addresses and phone numbers
- Selectors for page elements

## Running Tests

### All Tests
```bash
npm test
```

### Smoke Tests Only
```bash
npm run test:smoke
```

### Regression Tests
```bash
npm run test:regression
```

### Cross-Browser Testing
```bash
# Chrome/Chromium
npm run test:chrome

# Firefox
npm run test:firefox

# WebKit/Safari
npm run test:webkit
```

### Parallel Execution
```bash
npm run test:parallel
```

### Headed Mode (with browser UI)
```bash
npm run test:headed
```

### With HTML Report
```bash
npm run test:report
```

## Test Suites

### 1. Login Tests (`login.test.js`)
- Valid login with correct credentials
- Invalid login attempts (wrong username/password)
- Security validation (SQL injection, XSS)
- Empty credentials validation
- Password masking verification

### 2. Personal Details Tests (`personalDetails.test.js`)
- First name and last name validation
- Field editability checks
- Required field validation
- Special characters handling
- Data format validation

### 3. Contact Details Tests (`contactDetails.test.js`)
- Address update functionality
- Phone number update
- Invalid data validation
- ZIP code format validation
- Data persistence verification

### 4. Emergency Contacts Tests (`emergencyContacts.test.js`)
- Add emergency contact functionality
- Required field validation
- Phone number format validation
- Multiple contacts handling
- Data persistence checks

### 5. Non-Functional Tests (`nonFunctional.test.js`)
- Cross-browser compatibility
- Performance testing
- Responsive design validation
- Data persistence across sessions

### 6. Smoke Tests (`smokeTest.test.js`)
- Critical path validation
- Quick functionality checks
- Basic security validation
- Core user journey testing

## Page Object Model

The project uses Page Object Model (POM) design pattern:

- **LoginPage**: Handles login functionality
- **DashboardPage**: Manages dashboard operations and navigation
- **PersonalDetailsPage**: Manages personal details operations
- **ContactDetailsPage**: Handles contact details updates
- **EmergencyContactsPage**: Manages emergency contacts

## Reporting

### HTML Reports
HTML reports are generated automatically in `./reports/test-report.html`

### Screenshots
Screenshots are captured on test failures in `./reports/screenshots/`

### Videos
Test execution videos are saved in `./reports/videos/`

## Test Data Management

### Valid Test Data
- Username: Admin
- Password: admin123
- Sample addresses and phone numbers
- Emergency contact information

### Invalid Test Data
- Invalid credentials for negative testing
- Malformed phone numbers and ZIP codes
- SQL injection and XSS payloads

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:

```bash
# CI command
npm test -- --reporters=default --reporters=jest-html-reporter
```

Environment variables can be set in CI configuration for different environments.

## Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install
   ```

2. **Timeout Issues**
   - Increase timeout in jest.config.js
   - Check network connectivity
   - Verify application availability

3. **Element Not Found**
   - Update selectors in testData.js
   - Check if application UI has changed
   - Verify element timing and loading

4. **Test Data Issues**
   - Reset test data if demo environment was reset
   - Update credentials if they changed
   - Check field validation rules

### Debug Mode

Run tests in debug mode:
```bash
HEADED=true npm test -- --testNamePattern="specific test name"
```

### Logs and Screenshots

Check the following for debugging:
- `./reports/screenshots/` for failure screenshots
- `./reports/videos/` for test execution videos
- Console output for detailed error messages

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on other tests
2. **Page Object Model**: Use POM for maintainable code
3. **Wait Strategies**: Use appropriate wait strategies for dynamic content
4. **Test Data**: Use unique test data to avoid conflicts
5. **Clean Up**: Restore original data after tests when needed

## Contributing

1. Follow the existing code structure and naming conventions
2. Add appropriate wait strategies for new elements
3. Update selectors in testData.js for new elements
4. Include both positive and negative test cases
5. Add proper error handling and logging

## Test Coverage

The automation covers:
- ✅ Login functionality (positive and negative scenarios)
- ✅ Personal details validation
- ✅ Contact details updates
- ✅ Emergency contacts management
- ✅ Cross-browser compatibility
- ✅ Responsive design
- ✅ Performance testing
- ✅ Security validation
- ✅ Data persistence

## Known Limitations

- Demo application may have rate limiting
- Test data may be reset periodically by the demo system
- Some advanced features are not covered (out of scope)
- API testing is not included (UI automation focus)

For questions or issues, please refer to the test plan documentation or create an issue in the project repository.