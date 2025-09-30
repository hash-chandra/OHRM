const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class PersonalDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToPersonalDetails() {
    await this.page.click(SELECTORS.NAVIGATION.PERSONAL_DETAILS_TAB);
    await this.page.waitForLoadState('networkidle');
  }

  async getFirstName() {
    await this.page.waitForSelector(SELECTORS.PERSONAL_DETAILS.FIRST_NAME);
    return await this.page.inputValue(SELECTORS.PERSONAL_DETAILS.FIRST_NAME);
  }

  async getLastName() {
    await this.page.waitForSelector(SELECTORS.PERSONAL_DETAILS.LAST_NAME);
    return await this.page.inputValue(SELECTORS.PERSONAL_DETAILS.LAST_NAME);
  }

  async setFirstName(firstName) {
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.FIRST_NAME, firstName);
  }

  async setLastName(lastName) {
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.LAST_NAME, lastName);
  }

  async clearFirstName() {
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.FIRST_NAME, '');
  }

  async clearLastName() {
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.LAST_NAME, '');
  }

  async save() {
    await this.page.click(SELECTORS.PERSONAL_DETAILS.SAVE_BUTTON);
    await this.page.waitForTimeout(2000); // Wait for save operation
  }

  async getSuccessMessage() {
    try {
      await this.page.waitForSelector(SELECTORS.PERSONAL_DETAILS.SUCCESS_MESSAGE, { timeout: 5000 });
      return await this.page.textContent(SELECTORS.PERSONAL_DETAILS.SUCCESS_MESSAGE);
    } catch (error) {
      return null;
    }
  }

  async getErrorMessages() {
    try {
      const messages = await this.page.$$eval(
        '.oxd-input-field-error-message',
        elements => elements.map(el => el.textContent)
      );
      return messages;
    } catch (error) {
      return [];
    }
  }

  async isFieldEditable(fieldSelector) {
    const isDisabled = await this.page.getAttribute(fieldSelector, 'disabled');
    const isReadonly = await this.page.getAttribute(fieldSelector, 'readonly');
    return !isDisabled && !isReadonly;
  }

  async validateNameFormat(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }
}

module.exports = PersonalDetailsPage;