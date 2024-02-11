class Contact {
  #tags = [];
  #full_name;
  #email;
  #phone_number;

  constructor(full_name, email, phone_number, id, tags) {
    this.full_name(full_name);
    this.email(email);
    this.phone_number(phone_number);
    this.id = id;

    this.#parseTags(tags);
  }

  #parseTags(tags) {
    tags = tags || [];
    if (typeof tags === 'string') {
      tags = tags.split(',');
    }
    tags.forEach(this.addTag.bind(this));
  }

  toString() {
    let idString = `[${this.id}] `;
    let selfString = [this.#full_name, this.#email, this.#phone_number].join(' ');
    let tagString = this.#tags.length === 0 ? '' : ' Tags: ' + this.#tags.join(', ');

    return idString + selfString + tagString;
  }

  addTag(tag) {
    tag = tag.toLowerCase();
    if (tag.length > 0 && !this.#tags.includes(tag)) {
      this.#tags.push(tag);
    }
  }

  removeTag(tagToRemove) {
    let newTags = [];
    this.#tags.forEach(existingTag => {
      if (existingTag !== tagToRemove) {
        newTags.push(existingTag);
      }
    });

    this.#tags = newTags;
  }

  tags() {
    return this.#tags.slice();
  }

  // throws error if invalid full_name
  full_name(full_name) {
    if (full_name === undefined) {
      return this.#full_name;
    } else {
      this.#full_name = this.#validateName(full_name);
    }
}

  // throws error if invalid email
  email(email) {
    if (email === undefined) {
      return this.#email;
    } else {
      this.#email = this.#validateEmail(email);
    }
  }

  // throws error if invalid phone_number
  phone_number(phone_number) {
    if (phone_number === undefined) {
      return this.#phone_number;
    } else {
      this.#phone_number = this.#validatePhoneNumber(phone_number);
    }
  }


  #validateName(full_name) {
    console.log(typeof full_name);
    console.log(full_name);
    console.log(full_name.constructor);

    return this.#validateString(full_name, 'Name');
  }

  #validateEmail(email) {
    email = this.#validateString(email, 'Email');

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
      throw Error("There must be valid characters on either side of a single '@' sign");
    }

    let dotComponents = atComponents[1].split('.');
    if (validStringArray(dotComponents)) {
      throw Error("There must be valid characters on either side of a single '.' sign");
    }

    return email;
  }

  #validatePhoneNumber(phone_number) {
    phone_number = phone_number.split('').filter(char => !isNaN(parseInt(char))).join('');
    if (phone_number.length < 7) {
      throw Error("Phone number must contain at least 7 numbers")
    } else {
      return phone_number;
    }
  }

  #validateString(string, fieldName) {
    if (typeof string !== 'string') {
      throw Error(`${fieldName} field must be a string.`);
    } else if (string.trim().length === 0) {
      throw Error(`${fieldName} field must contain at least one non-whitespace character`);
    } else {
      return string;
    }
  }
}

class ContactList {
  #list = [];

  constructor(list) {
    if (list === undefined) {
      this.#list = [];
    } else if (list.constructor === 'Contact') {
      this.#list = list;
    } else {
      list.forEach(contactInfo => this.addContact(contactInfo));
    }
  }

  allTags() {
    let uniqueTags = [];
    this.#list.forEach(contact => {
      contact.tags.forEach(tag => {
        if (!uniqueTags.includes(tag)) {
          uniqueTags.push(tag);
        }
      });
    });

    return uniqueTags;
  }

  objects() {
    return this.#list.slice();
  }

  getContact(id) {
    let target;
    this.#list.forEach(contact => {
      if (contact.id === id) {
        target = contact;
      }
    });

    return target;
  }

  addContact(contactInfo) {
    if (!contactInfo.full_name || !contactInfo.email ||
        !contactInfo.phone_number || !contactInfo.id) {
          throw new Error('Invalid contactInfo does not contain the correct properties needed to create a Contact object');
        }

    let newContact;
    // try {
    //   newContact = new Contact(
    //     contactInfo.full_name,
    //     contactInfo.email,
    //     contactInfo.phone_number,
    //     contactInfo.id,
    //     contactInfo.tags,
    //   );
    // } catch(e) {
    //   let errorString = 'There was a problem with the contact info provided';
    //   throw new Error(errorString + '\n' + e.message);
    // }
    newContact = {
      full_name: contactInfo.full_name,
      email: contactInfo.email,
      phone_number: contactInfo.phone_number,
      id: contactInfo.id,
      tags: contactInfo.tags,
    }

    if (this.#list.map(existingContact => existingContact.id).includes(newContact.id)) {
      throw new Error("Cannot add Contact with duplicate id");
    } else {
      this.#list.push(newContact);
      console.log('Contact added successfully.');
    }
  }

  deleteContact(id) {
    let newList = [];
    for (let i = 0; i < this.#list.length; i++) {
      let contact = this.#list[i];
      if (contact.id !== id) {
        newList.push(contact);
      }
    }

    if (newList.length === this.#list.length) {
      console.log('No contact with that id found.');
    } else {
      console.log('Contact removed.');
    }
  }

  // returns a new ContactList with contacts that 
  // match a given text string
  searchContactsByText(text) {
    let results = {}
    this.#list.forEach((id, contact) => {
      if (contact.toString().includes(text)) {
        results[id] = contact;
      }
    });

    return new ContactList(results);
  }

  // returns a new ContactList with contacts that 
  // match a given tag
  searchContactsByTag(tag) {
    tag = tag.toLowerCase();
    let results = {}
    this.#list.forEach((id, contact) => {
      if (contact.tags().includes(tag)) {
        results[id] = contact;
      }
    });

    return new ContactList(results);
  }

  log() {
    this.#list.forEach((id, contact) => {
      contact.log(id);
    });
  }
}

const TemplateManager = {
  

  div: function(html) {
    let newDiv = document.createElement('div');
    newDiv.innerHTML = html;
    return newDiv;
  }
}

const FormManager = {
  receiveForm: function(form) {
    let list = form.querySelectorAll("[type='text']");
  
    let inputs = {};
    for (let i = 0; i < list.length; i++) {
      let input = list[i];
      inputs[input.name] = input.value;
    }
  
    return inputs;
  }
}

const App = {
  async init() {
    this.templates = TemplateManager.compileTemplates();
    this.list = new ContactList(await this.getContacts());

    await this.mainPage();
  },

  // main screen
    // add contact button
    // search inputs x2
    // contacts list
  async mainPage() {
    this.addFromTemplate('addContact');
    document.getElementById('addContact').addEventListener('click', e => {
      e.preventDefault();
      this.addContactPage();
    });

    let listToDisplay = this.list;
    this.addFromTemplate('searchBars');
    document.getElementById('searchBars').addEventListener('click', e => {
      console.log(this);
    });

    // add contact list edit/delete listeners
    this.displayList();
    document.getElementById('contactList').addEventListener('click', e => {
      e.preventDefault();
      let targetId = +e.target.parentElement.parentElement.querySelector('.id').textContent;
      
      switch (e.target.className) {
        case 'edit':
          let targetContact = this.list.getContact(targetId);
          this.editContactPage(targetContact);
          break;
        case 'delete':
          this.list.deleteContact(targetId);
          break;
        default:
          break;
      }
    })
  },

  displayList(list) {
    list = list || this.list.objects();
    console.log(list);
    let container = document.getElementById('contactList');
    container.innerHTML = this.templates['contactList']({ contacts: list })
    // this.addFromTemplate('contactList', { contacts: this.list });
  },

  // add contact screen
    // add contact form
    // add tag form
    // back button
  addContactPage() {
    document.body.innerHTML = '';
    this.addFromTemplate('addContactForm');
    this.addFromTemplate('tags');
    
    this.addBackButton();
  },

  
  // edit contact screen
    // edit contact form
    // add tag form
    // back button

  editContactPage(contactToEdit) {
    document.body.innerHTML = '';
    this.addFromTemplate('editContactForm', contactToEdit);
    this.addFromTemplate('tags');
    
    this.addBackButton();
  },

  addBackButton() {
    this.addFromTemplate('back');

    console.log(document.getElementById('back'));
    document.getElementById('back').addEventListener('click', e => {
      e.preventDefault();
      this.mainPage();
    });
  },


  

  addFromTemplate(templateName, object) {
    document.body.appendChild(TemplateManager.div(this.templates[templateName](object)));
  },

  // returns a `div` element with id `divId` containing element `element`
  wrap(divId, element) {
    let wrapper = document.createElement('div');
    wrapper.id = divId;
    if (element !== undefined) {
      wrapper.appendChild(element);
    }

    return wrapper;
  },

  
}

document.addEventListener('DOMContentLoaded', function() {
  App.init();
});

// containerDiv.innerHTML = templates['editForm']({ 
//   full_name: 'crosby',
//   email: 'test@joy.nerf',
//   phone_number: '123456789',
// });

// containerDiv.querySelector('form').addEventListener('submit', function(event) {
//   event.preventDefault();
//   receiveForm(this);
// })




// let test;
// API.getContact(1).then(contact => {
//   test = console.log(contact);

//   console.log('p' +test);
// });


// console.log(test);



// let list = new ContactList();

// list.addContact({
//   full_name: 'ben',
//   email: 'bbgm@gmail.com',
//   phone_number: '55544422234',
//   tags: ['thirsty', 'thirsty', 'cozy', ''],
// });

// list.addContact({
//   full_name: 'newtest',
//   email: 'is@an.email',
//   phone_number: '1234444444',
// });

// list.addContact({
//   full_name: 'newzephtest',
//   email: 'is@an.emaiffl',
//   phone_number: '1233454545',
// });

// list.log();

