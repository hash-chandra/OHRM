const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await this.page.fill(SELECTORS.LOGIN.USERNAME_INPUT, username);
    await this.page.fill(SELECTORS.LOGIN.PASSWORD_INPUT, password);
    await this.page.click(SELECTORS.LOGIN.LOGIN_BUTTON);
  }

  async getErrorMessage() {
    try {
      await this.page.waitForSelector(SELECTORS.LOGIN.ERROR_MESSAGE, { timeout: 5000 });
      return await this.page.textContent(SELECTORS.LOGIN.ERROR_MESSAGE);
    } catch (error) {
      return null;
    }
  }

  async getRequiredFieldMessages() {
    try {
      const messages = await this.page.$$eval(
        SELECTORS.LOGIN.REQUIRED_MESSAGE,
        elements => elements.map(el => el.textContent)
      );
      return messages;
    } catch (error) {
      return [];
    }
  }

  async isPasswordMasked() {
    const passwordType = await this.page.getAttribute(SELECTORS.LOGIN.PASSWORD_INPUT, 'type');
    return passwordType === 'password';
  }

  async clearFields() {
    await this.page.fill(SELECTORS.LOGIN.USERNAME_INPUT, '');
    await this.page.fill(SELECTORS.LOGIN.PASSWORD_INPUT, '');
  }
}

module.exports = LoginPage;