class TestUtils {
  /**
   * Generate random string for test data
   * @param {number} length - Length of random string
   * @returns {string} Random string
   */
  static generateRandomString(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email for test data
   * @returns {string} Random email
   */
  static generateRandomEmail() {
    const randomString = this.generateRandomString(8);
    return `test.${randomString}@example.com`;
  }

  /**
   * Generate random phone number for test data
   * @returns {string} Random phone number
   */
  static generateRandomPhone() {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `+1-${areaCode}-${exchange}-${number}`;
  }

  /**
   * Generate random zip code for test data
   * @returns {string} Random zip code
   */
  static generateRandomZip() {
    return String(Math.floor(Math.random() * 90000) + 10000);
  }

  /**
   * Wait for element to be stable (not moving)
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForElementStable(page, selector, timeout = 5000) {
    let previousBox = null;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const currentBox = await page.boundingBox(selector);
        
        if (previousBox && currentBox) {
          const isStable = 
            Math.abs(currentBox.x - previousBox.x) < 1 &&
            Math.abs(currentBox.y - previousBox.y) < 1 &&
            Math.abs(currentBox.width - previousBox.width) < 1 &&
            Math.abs(currentBox.height - previousBox.height) < 1;
          
          if (isStable) {
            return true;
          }
        }
        
        previousBox = currentBox;
        await page.waitForTimeout(100);
      } catch (error) {
        // Element might not be visible yet
        await page.waitForTimeout(100);
      }
    }
    
    return false;
  }

  /**
   * Take screenshot with timestamp
   * @param {Object} page - Playwright page object
   * @param {string} testName - Test name for screenshot filename
   */
  static async takeScreenshot(page, testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./reports/screenshots/${testName}_${timestamp}.png`;
    
    try {
      await page.screenshot({ 
        path: filename, 
        fullPage: true 
      });
      return filename;
    } catch (error) {
      return null;
    }
  }

  /**
   * Wait for network to be idle
   * @param {Object} page - Playwright page object
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForNetworkIdle(page, timeout = 10000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Scroll element into view
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   */
  static async scrollIntoView(page, selector) {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);
    await page.waitForTimeout(500); // Wait for scroll animation
  }

  /**
   * Get current timestamp for test data
   * @returns {string} Formatted timestamp
   */
  static getCurrentTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone format
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[\+\-\s\(\)\d]+$/;
    const digitsOnly = phone.replace(/[\+\-\s\(\)]/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  }

  /**
   * Validate zip code format
   * @param {string} zip - Zip code to validate
   * @returns {boolean} True if valid zip format
   */
  static isValidZip(zip) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  }

  /**
   * Clean test data - remove special characters for safe file names
   * @param {string} text - Text to clean
   * @returns {string} Cleaned text
   */
  static cleanTextForFilename(text) {
    return text.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Base delay in milliseconds
   * @returns {*} Function result
   */
  static async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error; // Last attempt failed
        }
        
        const delay = baseDelay * Math.pow(2, i); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Generate test data object with all required fields
   * @returns {Object} Test data object
   */
  static generateTestData() {
    return {
      user: {
        firstName: this.generateRandomString(6),
        lastName: this.generateRandomString(8),
        email: this.generateRandomEmail()
      },
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} ${this.generateRandomString(5)} Street`,
        city: this.generateRandomString(7),
        state: this.generateRandomString(2).toUpperCase(),
        zip: this.generateRandomZip()
      },
      contact: {
        phone: this.generateRandomPhone(),
        mobile: this.generateRandomPhone()
      },
      emergencyContact: {
        name: `${this.generateRandomString(6)} ${this.generateRandomString(7)}`,
        relationship: ['Parent', 'Sibling', 'Spouse', 'Friend'][Math.floor(Math.random() * 4)],
        homePhone: this.generateRandomPhone(),
        mobile: this.generateRandomPhone()
      }
    };
  }
}

module.exports = TestUtils;