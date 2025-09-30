const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class ContactDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToContactDetails() {
    await this.page.click(SELECTORS.NAVIGATION.CONTACT_DETAILS_TAB);
    await this.page.waitForLoadState('networkidle');
  }

  async updateAddress(addressData) {
    if (addressData.street) {
      await this.page.fill(SELECTORS.CONTACT_DETAILS.STREET1, addressData.street);
    }
    if (addressData.city) {
      await this.page.fill(SELECTORS.CONTACT_DETAILS.CITY, addressData.city);
    }
    if (addressData.state) {
      await this.page.fill(SELECTORS.CONTACT_DETAILS.STATE, addressData.state);
    }
    if (addressData.zip) {
      await this.page.fill(SELECTORS.CONTACT_DETAILS.ZIP, addressData.zip);
    }
  }

  async updatePhoneNumber(phoneNumber) {
    await this.page.fill(SELECTORS.CONTACT_DETAILS.MOBILE_PHONE, phoneNumber);
  }

  async clearAddress() {
    await this.page.fill(SELECTORS.CONTACT_DETAILS.STREET1, '');
    await this.page.fill(SELECTORS.CONTACT_DETAILS.CITY, '');
    await this.page.fill(SELECTORS.CONTACT_DETAILS.STATE, '');
    await this.page.fill(SELECTORS.CONTACT_DETAILS.ZIP, '');
  }

  async getAddressData() {
    return {
      street: await this.page.inputValue(SELECTORS.CONTACT_DETAILS.STREET1),
      city: await this.page.inputValue(SELECTORS.CONTACT_DETAILS.CITY),
      state: await this.page.inputValue(SELECTORS.CONTACT_DETAILS.STATE),
      zip: await this.page.inputValue(SELECTORS.CONTACT_DETAILS.ZIP)
    };
  }

  async getPhoneNumber() {
    return await this.page.inputValue(SELECTORS.CONTACT_DETAILS.MOBILE_PHONE);
  }

  async save() {
    await this.page.click(SELECTORS.CONTACT_DETAILS.SAVE_BUTTON);
    await this.page.waitForTimeout(2000);
  }

  async getSuccessMessage() {
    try {
      await this.page.waitForSelector('.oxd-toast-content-text', { timeout: 5000 });
      return await this.page.textContent('.oxd-toast-content-text');
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

  async validatePhoneFormat(phone) {
    // Basic phone validation - should contain numbers and may have + - ( ) space
    return /^[\+\-\s\(\)\d]+$/.test(phone) && phone.replace(/[\+\-\s\(\)]/g, '').length >= 10;
  }

  async validateZipFormat(zip) {
    // Basic zip validation - should be 5 digits or 5+4 format
    return /^\d{5}(-\d{4})?$/.test(zip);
  }
}

module.exports = ContactDetailsPage;