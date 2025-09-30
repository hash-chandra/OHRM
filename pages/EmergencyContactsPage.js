const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class EmergencyContactsPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToEmergencyContacts() {
    await this.page.click(SELECTORS.NAVIGATION.EMERGENCY_CONTACTS_TAB);
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddButton() {
    await this.page.click(SELECTORS.EMERGENCY_CONTACTS.ADD_BUTTON);
    await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.NAME_INPUT);
  }

  async addEmergencyContact(contactData) {
    await this.clickAddButton();
    
    if (contactData.name) {
      await this.page.fill(SELECTORS.EMERGENCY_CONTACTS.NAME_INPUT, contactData.name);
    }
    if (contactData.relationship) {
      await this.page.fill(SELECTORS.EMERGENCY_CONTACTS.RELATIONSHIP_INPUT, contactData.relationship);
    }
    if (contactData.homePhone) {
      await this.page.fill(SELECTORS.EMERGENCY_CONTACTS.HOME_PHONE_INPUT, contactData.homePhone);
    }
    if (contactData.mobile) {
      await this.page.fill(SELECTORS.EMERGENCY_CONTACTS.MOBILE_INPUT, contactData.mobile);
    }
  }

  async save() {
    await this.page.click(SELECTORS.EMERGENCY_CONTACTS.SAVE_BUTTON);
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

  async getEmergencyContactsList() {
    try {
      await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.CONTACT_LIST);
      const contacts = await this.page.$$eval(
        `${SELECTORS.EMERGENCY_CONTACTS.CONTACT_LIST} .oxd-table-row`,
        rows => rows.map(row => {
          const cells = row.querySelectorAll('.oxd-table-cell');
          return {
            name: cells[1]?.textContent || '',
            relationship: cells[2]?.textContent || '',
            homePhone: cells[3]?.textContent || '',
            mobile: cells[4]?.textContent || ''
          };
        })
      );
      return contacts;
    } catch (error) {
      return [];
    }
  }

  async isContactInList(contactName) {
    const contacts = await this.getEmergencyContactsList();
    return contacts.some(contact => contact.name.includes(contactName));
  }

  async validatePhoneFormat(phone) {
    return /^[\+\-\s\(\)\d]+$/.test(phone) && phone.replace(/[\+\-\s\(\)]/g, '').length >= 10;
  }

  async validateNameFormat(name) {
    // Allow letters, spaces, apostrophes, and hyphens
    return /^[a-zA-Z\s\'\-]+$/.test(name);
  }
}

module.exports = EmergencyContactsPage;