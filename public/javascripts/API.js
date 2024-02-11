const API = {
  async getContacts() {
    const response = await fetch(`http://localhost:3000/api/contacts`);
    return await response.json();
  },

  async getContact(id) {
    const response = await fetch(`http://localhost:3000/api/contacts/${id}`);
    return await response.json();
  },

  async addContact(contactInfo) {
    try {
      contactInfo = ValidationManager.validateInfo(contactInfo);
      console.log('contactInfo before xhr post is: ');
      console.log(contactInfo);
      const response = await fetch("http://localhost:3000/api/contacts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(contactInfo),
      });

      return response;
    } catch(e) {
      return false;
    }
  },


  async editContact(id, contactInfo) {
    contactInfo = ValidationManager.validateInfo(contactInfo);
    const response = await fetch(`http://localhost:3000/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(contactInfo),
    });

    return response;
  },

  async deleteContact(id) {
    if (confirm('Delete contact?')) {
      const response = await fetch(`http://localhost:3000/api/contacts/${id}`, {
        method: 'DELETE',
      })
        .then(() => alert('Contact deleted.'));

      return response;
    }
  }
}
