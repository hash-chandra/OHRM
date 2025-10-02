const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class MyInfoPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToMyInfo() {
    await this.page.click(SELECTORS.NAVIGATION.MY_INFO_MENU);
    await this.page.waitForLoadState('networkidle');
  }

  async isMyInfoPageVisible() {
    try {
      await this.page.waitForSelector(SELECTORS.MY_INFO.PAGE_HEADER, { timeout: 10000 });
      const headerText = await this.page.textContent(SELECTORS.MY_INFO.PAGE_HEADER);
      return headerText.includes('PIM');
    } catch (error) {
      return false;
    }
  }

  async navigateToPersonalDetails() {
    await this.page.click(SELECTORS.NAVIGATION.PERSONAL_DETAILS_TAB);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToContactDetails() {
    await this.page.click(SELECTORS.NAVIGATION.CONTACT_DETAILS_TAB);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToEmergencyContacts() {
    await this.page.click(SELECTORS.NAVIGATION.EMERGENCY_CONTACTS_TAB);
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = MyInfoPage;
