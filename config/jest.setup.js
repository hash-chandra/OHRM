const { chromium, firefox, webkit } = require('playwright');

let browser;
let context;
let page;

// Global setup for Jest with Playwright
beforeAll(async () => {
  // Determine browser type from environment variable
  const browserType = process.env.BROWSER || 'chromium';
  const headless = !process.env.HEADED;
  
  switch (browserType) {
    case 'firefox':
      browser = await firefox.launch({ headless });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless });
      break;
    default:
      browser = await chromium.launch({ headless });
  }
  
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    recordVideo: {
      dir: './reports/videos/',
      size: { width: 1920, height: 1080 }
    }
  });
  
  page = await context.newPage();
  
  // Make page available globally
  global.page = page;
  global.context = context;
});

afterAll(async () => {
  if (context) await context.close();
  if (browser) await browser.close();
});

// Screenshot on test failure
afterEach(async () => {
  const testState = expect.getState && expect.getState();
  if (
    global.page &&
    testState &&
    testState.currentTestName &&
    (
      testState.status === 'failed' ||
      (Array.isArray(testState.assertions) && testState.assertions.some(a => a.status === 'failed'))
    )
  ) {
    const testName = testState.currentTestName.replace(/[^a-zA-Z0-9]/g, '_');
    const screenshotPath = `./reports/screenshots/${testName}_${Date.now()}.png`;
    try {
      await global.page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
    } catch (error) {
      // Screenshot failed, continue silently
    }
  }
});

// Custom Jest matchers for better assertions
expect.extend({
  async toBeVisible(element) {
    try {
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return {
        message: () => 'Element is visible',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => 'Element is not visible',
        pass: false,
      };
    }
  },
});

// Global timeout
jest.setTimeout(30000);