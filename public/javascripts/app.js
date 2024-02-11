const App = {
  async init() {
    this.getElements();
    this.addHandlers();
    this.templates = TemplateManager.compileTemplates();
    await this.showMainPage();
  },

  getElements() {
    this.addContactButton = document.getElementById('addContactButton');
    this.mainPage = document.getElementById('mainPage');
    this.searchBars = document.getElementById('searchBars');
    this.searchBarText = document.getElementById('searchBarText');
    this.searchBarTags = document.getElementById('searchBarTags');

    this.listContainer = document.getElementById('listContainer');

    this.formPage = document.getElementById('formPage');
    this.formContainer = document.getElementById('formContainer');
    this.back = document.getElementById('back');
  },

  addHandlers() {
    // add contact
    this.addContactButton.addEventListener('click', e => {
      e.preventDefault();
      this.showFormPage('add');
    });

    // edit/add form submit
    this.formPage.addEventListener('submit', async e => {
      e.preventDefault();
      let contactInfo = FormManager.receive(e.target);
      
      let success;
      if (e.target.id === 'editContactForm') {
        let id = +e.target.querySelector('#contactId').textContent;
        success = await API.editContact(id, contactInfo);
      } else if (e.target.id === 'addContactForm') {
        success = await API.addContact(contactInfo);
      }       

      if (success) {
        this.showMainPage();
      };
    });

    // edit/delete buttons
    this.listContainer.addEventListener('click', async (e) => {
      e.preventDefault();
      if (e.target.tagName !== 'BUTTON') { return; }

      let id = e.target.parentElement.parentElement.firstElementChild.childNodes[1].textContent;
      if (e.target.textContent === 'Edit') {
        let contactToEdit = await API.getContact(id);
        this.showFormPage('edit', contactToEdit);
      } else if (e.target.textContent === 'Delete') {
        await API.deleteContact(id);
        this.writeList();
      }
    });

    // back button
    this.back.addEventListener('click', e => {
      e.preventDefault();
      this.showMainPage();
    });

    // search text
    this.searchBars.addEventListener('input', async (e) => {
      console.log(e.target.value);
      let textSearchString = this.searchBarText.value;
      let tagSearchString = this.searchBarTags.value;

      console.log('text string: ' + textSearchString);
      console.log('tag string: ' + tagSearchString);

      await this.writeList(ListManager.search(await API.getContacts(), textSearchString, tagSearchString));
    });

    // this.searchBars.addEventListener('focusout', e => {

    // });
  },

  async writeList(optionalList) {
    let contacts = optionalList || await API.getContacts();
    this.listContainer.innerHTML = 
      this.templates['contactList']({ contacts });
  },

  hideFormPage() {
    document.body.appendChild(this.formPage);
    this.formPage.style.visibility = 'hidden';
    this.formPage.style.visibility = 'hidden';
  },

  showFormPage(type, contactObject={}) {
    this.hideMainPage();
    this.formPage.style.visibility = 'visible';
    this.formContainer.innerHTML = this.templates[type + 'ContactForm'](contactObject);
  },

  hideMainPage() {
    document.body.appendChild(this.mainPage);
    this.mainPage.style.visibility = 'hidden';
  },

  showMainPage() {
    this.hideFormPage();
    this.mainPage.style.visibility = 'visible';
    this.writeList();
  }
}


$(function() {
  App.init();
});