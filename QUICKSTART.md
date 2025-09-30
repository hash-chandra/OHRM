# OrangeHRM Test Automation - Quick Start Guide

## 🚀 Quick Setup

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Or manual setup:**
   ```bash
   npm install
   npx playwright install
   cp .env.example .env
   ```

## 🧪 Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:smoke
npm run test:regression

# Run in different browsers
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run with browser UI visible
npm run test:headed

# Generate HTML report
npm run test:report
```

### Test Suites Overview

| Command | Description | Duration |
|---------|-------------|----------|
| `npm run test:smoke` | Critical path tests | ~5 minutes |
| `npm test` | All regression tests | ~30 minutes |
| `npm run test:headed` | Run with browser UI | Variable |

## 📋 Test Coverage

✅ **Login Functionality**
- Valid/invalid credentials
- Security validation (SQL injection, XSS)
- Password masking
- Session management

✅ **Personal Details**
- Name validation
- Field editability
- Required field checks
- Special character handling

✅ **Contact Details**
- Address updates
- Phone number validation
- ZIP code format checks
- Data persistence

✅ **Emergency Contacts**
- Add new contacts
- Required field validation
- Phone format validation
- Multiple contacts handling

✅ **Non-Functional Testing**
- Cross-browser compatibility
- Responsive design
- Performance testing
- Data persistence

## 🔧 Configuration

### Environment Variables (.env)
```bash
BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
TEST_USERNAME=Admin
TEST_PASSWORD=admin123
BROWSER=chromium
HEADED=false
```

### Browser Options
- `chromium` (default)
- `firefox`
- `webkit`

### Running Specific Tests
```bash
# Run specific test file
npx jest tests/login.test.js

# Run specific test by name
npx jest --testNamePattern="Valid Login"

# Run tests matching pattern
npx jest --testNamePattern="Smoke Test"
```

## 📊 Reports and Debugging

### HTML Reports
- Generated automatically in `./reports/test-report.html`
- Open in browser to view detailed results

### Screenshots
- Captured on test failures
- Saved in `./reports/screenshots/`

### Videos
- Test execution recordings
- Saved in `./reports/videos/`

### Debug Mode
```bash
# Run in headed mode for debugging
HEADED=true npm test

# Run specific test in debug mode
HEADED=true npx jest --testNamePattern="specific test" --verbose
```

## 🔍 Troubleshooting

### Common Issues

1. **"Browser not found" error:**
   ```bash
   npx playwright install
   ```

2. **Test timeouts:**
   - Check internet connection
   - Verify OrangeHRM demo site is accessible
   - Increase timeout in jest.setup.js

3. **Element not found:**
   - Application UI might have changed
   - Update selectors in config/testData.js

4. **Permission denied for setup.sh:**
   ```bash
   chmod +x setup.sh
   ```

### Getting Help

1. Check `./reports/screenshots/` for failure screenshots
2. Review console output for error details
3. Run in headed mode to see browser actions
4. Check test execution videos in `./reports/videos/`

## 📝 Test Data

### Default Credentials
- **Username:** Admin
- **Password:** admin123

### Sample Test Data
- Addresses with various formats
- Phone numbers (valid/invalid)
- Emergency contacts
- Special characters for security testing

## 🎯 Best Practices

1. **Run smoke tests first** to verify basic functionality
2. **Use headed mode** for debugging test issues
3. **Check reports** for detailed test results
4. **Update selectors** if application UI changes
5. **Clear browser data** if tests behave unexpectedly

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run OrangeHRM Tests
  run: |
    npm install
    npx playwright install
    npm test
```

### Jenkins Pipeline
```groovy
stage('E2E Tests') {
    steps {
        sh 'npm install'
        sh 'npx playwright install'
        sh 'npm test'
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'test-report.html',
                reportName: 'Test Report'
            ])
        }
    }
}
```

---

**Need more details?** Check the full README.md for comprehensive documentation.