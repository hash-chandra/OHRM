const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class ContactDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async updateContactDetails(addressData) {
    // Get all input fields on the page
    const allInputs = await this.page.$$('.oxd-input');
    
    // Address fields are typically at indices 0-4 in the contact details form
    // Fill Street 1 (index 0)
    if (addressData.street1 && allInputs[0]) {
      await allInputs[0].fill('');
      await allInputs[0].fill(addressData.street1);
    }
    
    // Fill Street 2 (index 1)
    if (addressData.street2 && allInputs[1]) {
      await allInputs[1].fill('');
      await allInputs[1].fill(addressData.street2);
    }
    
    // Fill City (index 2)
    if (addressData.city && allInputs[2]) {
      await allInputs[2].fill('');
      await allInputs[2].fill(addressData.city);
    }
    
    // Fill State/Province (index 3)
    if (addressData.state && allInputs[3]) {
      await allInputs[3].fill('');
      await allInputs[3].fill(addressData.state);
    }
    
    // Fill Zip/Postal Code (index 4)
    if (addressData.zip && allInputs[4]) {
      await allInputs[4].fill('');
      await allInputs[4].fill(addressData.zip);
    }
  }

  async updatePhoneNumbers(phoneData) {
    // Get all input fields on the page
    const allInputs = await this.page.$$('.oxd-input');
    
    // Phone fields are typically at indices 7, 8, 9 in the contact details form
    // Fill Home Phone (index 7)
    if (phoneData.homePhone && allInputs[7]) {
      await allInputs[7].fill('');
      await allInputs[7].fill(phoneData.homePhone);
    }
    
    // Fill Mobile Phone (index 8)
    if (phoneData.mobilePhone && allInputs[8]) {
      await allInputs[8].fill('');
      await allInputs[8].fill(phoneData.mobilePhone);
    }
    
    // Fill Work Phone (index 9)
    if (phoneData.workPhone && allInputs[9]) {
      await allInputs[9].fill('');
      await allInputs[9].fill(phoneData.workPhone);
    }
  }

  async clickSave() {
    // Find and click the first save button on the page
    const saveButtons = await this.page.$$(SELECTORS.CONTACT_DETAILS.SAVE_BUTTON);
    if (saveButtons.length > 0) {
      await saveButtons[0].click();
    }
  }

  async getSuccessMessage() {
    try {
      await this.page.waitForSelector(SELECTORS.CONTACT_DETAILS.SUCCESS_MESSAGE, { timeout: 5000 });
      return await this.page.textContent(SELECTORS.CONTACT_DETAILS.SUCCESS_MESSAGE);
    } catch (error) {
      return null;
    }
  }

  async getAddressValues() {
    const allInputs = await this.page.$$('.oxd-input');
    
    return {
      street1: allInputs[0] ? await allInputs[0].inputValue() : '',
      street2: allInputs[1] ? await allInputs[1].inputValue() : '',
      city: allInputs[2] ? await allInputs[2].inputValue() : '',
      state: allInputs[3] ? await allInputs[3].inputValue() : '',
      zip: allInputs[4] ? await allInputs[4].inputValue() : ''
    };
  }

  async getPhoneValues() {
    const allInputs = await this.page.$$('.oxd-input');
    
    return {
      homePhone: allInputs[7] ? await allInputs[7].inputValue() : '',
      mobilePhone: allInputs[8] ? await allInputs[8].inputValue() : '',
      workPhone: allInputs[9] ? await allInputs[9].inputValue() : ''
    };
  }

  async getErrorMessage() {
    try {
      await this.page.waitForSelector(SELECTORS.CONTACT_DETAILS.ERROR_MESSAGE, { timeout: 5000 });
      const errorElements = await this.page.$$(SELECTORS.CONTACT_DETAILS.ERROR_MESSAGE);
      if (errorElements.length > 0) {
        return await errorElements[0].textContent();
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = ContactDetailsPage;
