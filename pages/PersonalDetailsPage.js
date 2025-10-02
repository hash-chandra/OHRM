const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class PersonalDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async isFirstNameFieldPresent() {
    try {
      const firstNameField = await this.page.$(SELECTORS.PERSONAL_DETAILS.FIRST_NAME);
      return firstNameField !== null;
    } catch (error) {
      return false;
    }
  }

  async isLastNameFieldPresent() {
    try {
      const lastNameField = await this.page.$(SELECTORS.PERSONAL_DETAILS.LAST_NAME);
      return lastNameField !== null;
    } catch (error) {
      return false;
    }
  }

  async getFirstNameValue() {
    try {
      await this.page.waitForSelector(SELECTORS.PERSONAL_DETAILS.FIRST_NAME, { timeout: 5000 });
      return await this.page.inputValue(SELECTORS.PERSONAL_DETAILS.FIRST_NAME);
    } catch (error) {
      return null;
    }
  }

  async getLastNameValue() {
    try {
      await this.page.waitForSelector(SELECTORS.PERSONAL_DETAILS.LAST_NAME, { timeout: 5000 });
      return await this.page.inputValue(SELECTORS.PERSONAL_DETAILS.LAST_NAME);
    } catch (error) {
      return null;
    }
  }

  async updateFirstName(firstName) {
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.FIRST_NAME, '');
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.FIRST_NAME, firstName);
  }

  async updateLastName(lastName) {
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.LAST_NAME, '');
    await this.page.fill(SELECTORS.PERSONAL_DETAILS.LAST_NAME, lastName);
  }

  async clickSave() {
    // Find the save button in the personal details form
    const saveButtons = await this.page.$$(SELECTORS.PERSONAL_DETAILS.SAVE_BUTTON);
    if (saveButtons.length > 0) {
      await saveButtons[0].click();
    }
  }

  async getSuccessMessage() {
    try {
      await this.page.waitForSelector(SELECTORS.PERSONAL_DETAILS.SUCCESS_MESSAGE, { timeout: 5000 });
      return await this.page.textContent(SELECTORS.PERSONAL_DETAILS.SUCCESS_MESSAGE);
    } catch (error) {
      return null;
    }
  }

  async isFieldDisabled(fieldSelector) {
    try {
      const isDisabled = await this.page.getAttribute(fieldSelector, 'disabled');
      return isDisabled !== null;
    } catch (error) {
      return false;
    }
  }
}

module.exports = PersonalDetailsPage;
