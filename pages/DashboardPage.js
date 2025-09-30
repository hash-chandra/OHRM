const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class DashboardPage {
  constructor(page) {
    this.page = page;
  }

  async isDashboardVisible() {
    try {
      await this.page.waitForSelector(SELECTORS.DASHBOARD.DASHBOARD_HEADER, { timeout: 10000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserName() {
    try {
      await this.page.waitForSelector(SELECTORS.DASHBOARD.USER_DROPDOWN, { timeout: 5000 });
      return await this.page.textContent(SELECTORS.DASHBOARD.USER_DROPDOWN);
    } catch (error) {
      return null;
    }
  }

  async navigateToMyInfo() {
    await this.page.click(SELECTORS.NAVIGATION.MY_INFO_MENU);
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.page.click(SELECTORS.DASHBOARD.USER_DROPDOWN);
    await this.page.click(SELECTORS.DASHBOARD.LOGOUT_OPTION);
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = DashboardPage;