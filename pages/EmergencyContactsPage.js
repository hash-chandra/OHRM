const { SELECTORS, DEFAULT_TIMEOUT } = require('../config/testData');

class EmergencyContactsPage {
  constructor(page) {
    this.page = page;
  }

  async clickAddButton() {
    await this.page.click(SELECTORS.EMERGENCY_CONTACTS.ADD_BUTTON);
    await this.page.waitForTimeout(1000); // Wait for form to appear
  }

  async fillEmergencyContactForm(contactData) {
    // Wait for form to be fully loaded
    await this.page.waitForSelector('.oxd-input', { timeout: 5000 });
    const allInputs = await this.page.$$('.oxd-input');
    
    // Emergency contact form typically has fields at the end of the input list
    // We'll target the last 5 inputs which are usually the form fields
    const formStartIndex = allInputs.length - 5;
    
    // Fill Name (last 5th input)
    if (contactData.name !== undefined && allInputs[formStartIndex]) {
      await allInputs[formStartIndex].fill('');
      if (contactData.name) {
        await allInputs[formStartIndex].fill(contactData.name);
      }
    }
    
    // Fill Relationship (last 4th input)
    if (contactData.relationship !== undefined && allInputs[formStartIndex + 1]) {
      await allInputs[formStartIndex + 1].fill('');
      if (contactData.relationship) {
        await allInputs[formStartIndex + 1].fill(contactData.relationship);
      }
    }
    
    // Fill Home Telephone (last 3rd input)
    if (contactData.homePhone !== undefined && allInputs[formStartIndex + 2]) {
      await allInputs[formStartIndex + 2].fill('');
      if (contactData.homePhone) {
        await allInputs[formStartIndex + 2].fill(contactData.homePhone);
      }
    }
    
    // Fill Mobile (last 2nd input)
    if (contactData.mobile !== undefined && allInputs[formStartIndex + 3]) {
      await allInputs[formStartIndex + 3].fill('');
      if (contactData.mobile) {
        await allInputs[formStartIndex + 3].fill(contactData.mobile);
      }
    }
    
    // Fill Work Telephone (last input)
    if (contactData.workPhone !== undefined && allInputs[formStartIndex + 4]) {
      await allInputs[formStartIndex + 4].fill('');
      if (contactData.workPhone) {
        await allInputs[formStartIndex + 4].fill(contactData.workPhone);
      }
    }
  }

  async clickSave() {
    // Wait for save button to be ready
    await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.SAVE_BUTTON, { timeout: 5000 });
    
    // Use page.click with selector instead of elementHandle
    await this.page.click(SELECTORS.EMERGENCY_CONTACTS.SAVE_BUTTON);
    
    // Wait for the action to complete
    await this.page.waitForTimeout(1000);
  }

  async clickCancel() {
    await this.page.click(SELECTORS.EMERGENCY_CONTACTS.CANCEL_BUTTON);
  }

  async getSuccessMessage() {
    try {
      await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.SUCCESS_MESSAGE, { timeout: 5000 });
      return await this.page.textContent(SELECTORS.EMERGENCY_CONTACTS.SUCCESS_MESSAGE);
    } catch (error) {
      return null;
    }
  }

  async getErrorMessages() {
    try {
      await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.ERROR_MESSAGE, { timeout: 3000 });
      const errorElements = await this.page.$$(SELECTORS.EMERGENCY_CONTACTS.ERROR_MESSAGE);
      const messages = [];
      for (const element of errorElements) {
        const text = await element.textContent();
        messages.push(text);
      }
      return messages;
    } catch (error) {
      return [];
    }
  }

  async isContactInList(name, phone) {
    try {
      await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.CONTACT_LIST, { timeout: 5000 });
      const rows = await this.page.$$(SELECTORS.EMERGENCY_CONTACTS.CONTACT_ROW);
      
      for (const row of rows) {
        const cells = await row.$$(SELECTORS.EMERGENCY_CONTACTS.CONTACT_CELL);
        if (cells.length >= 2) {
          const rowName = await cells[1].textContent();
          const rowPhone = await cells[3].textContent(); // Home Telephone column
          
          if (rowName.trim() === name && rowPhone.trim() === phone) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async getContactCount() {
    try {
      await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.CONTACT_LIST, { timeout: 5000 });
      const rows = await this.page.$$(SELECTORS.EMERGENCY_CONTACTS.CONTACT_ROW);
      return rows.length;
    } catch (error) {
      return 0;
    }
  }

  async deleteContactByNameAndPhone(name, phone) {
    try {
      await this.page.waitForSelector(SELECTORS.EMERGENCY_CONTACTS.CONTACT_LIST, { timeout: 5000 });
      const rows = await this.page.$$(SELECTORS.EMERGENCY_CONTACTS.CONTACT_ROW);
      
      for (const row of rows) {
        const cells = await row.$$(SELECTORS.EMERGENCY_CONTACTS.CONTACT_CELL);
        if (cells.length >= 2) {
          const rowName = await cells[1].textContent();
          const rowPhone = await cells[3].textContent();
          
          if (rowName.trim() === name && rowPhone.trim() === phone) {
            // Find delete button in this row
            const deleteButton = await row.$(SELECTORS.EMERGENCY_CONTACTS.DELETE_BUTTON);
            if (deleteButton) {
              await deleteButton.click();
              await this.page.waitForTimeout(500);
              // Confirm deletion
              await this.page.click(SELECTORS.EMERGENCY_CONTACTS.CONFIRM_DELETE_BUTTON);
              await this.page.waitForTimeout(1000);
              return true;
            }
          }
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async isNoRecordsFound() {
    try {
      const noRecords = await this.page.$(SELECTORS.EMERGENCY_CONTACTS.NO_RECORDS_FOUND);
      return noRecords !== null;
    } catch (error) {
      return false;
    }
  }
}

module.exports = EmergencyContactsPage;
