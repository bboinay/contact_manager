const ValidationManager = {
    validateInfo(contactInfo) {
    try {
      contactInfo.full_name = this.validateName(contactInfo.full_name);
      contactInfo.email = this.validateEmail(contactInfo.email);
      contactInfo.phone_number = this.validatePhoneNumber(contactInfo.phone_number);
      contactInfo.tags = this.standardizeTagString(contactInfo.tags);

      return contactInfo;
    } catch(e) {
      alert(e.message);
      throw new Error('Contact information was invalid.');
    }
  },

  standardizeTagString(tagString) {
    return ListManager.stringToArray(tagString).join(',');
  },

  validateName(full_name='') {  
    return this.validateString(full_name, 'Name');
  },
  
  validateEmail(email='') {
    email = this.validateString(email, 'Email');
  
    if (!email.includes('@') || 
        !email.includes('.') ||
        email.indexOf('@') > email.indexOf('.')
    ) {
      throw Error("Email must include an '@' before a '.'");
    }
  
    function validStringArray(array) {
      return (array.length !== 2 || array.some(string => !string.trim()));
    }
  
    let atComponents = email.split('@');
    if (validStringArray(atComponents)) {
      throw Error("Email must contain valid characters on either side of a single '@' sign");
    }
  
    let dotComponents = atComponents[1].split('.');
    if (validStringArray(dotComponents)) {
      throw Error("Email must contain valid characters on either side of a single '.' sign");
    }
  
    return email;
  },
  
  validatePhoneNumber(phone_number='') {
    phone_number = phone_number.split('').filter(char => !isNaN(parseInt(char))).join('');
    if (phone_number.length < 7) {
      throw Error("Phone number must contain at least 7 numbers")
    } else {
      return phone_number;
    }
  },
  
  validateString(string='', fieldName) {
    if (typeof string !== 'string') {
      throw Error(`${fieldName} field must be a string.`);
    } else if (string.trim().length === 0) {
      throw Error(`${fieldName} field must contain at least one non-whitespace character`);
    } else {
      return string;
    }
  },
}


