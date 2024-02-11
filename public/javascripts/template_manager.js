const TemplateManager = {
  compileTemplates() {
    this.registerPartials();

    let templates = {};
    let list = document.querySelectorAll('[type="text/x-handlebars"]');
  
    for (let i = 0; i < list.length; i++) {
      let template = list[i];
      let templateName = template.id;
      templates[templateName] = Handlebars.compile(template.innerHTML);
      template.remove();
    }
  
    return templates;
  },

  registerPartials() {
    let list = document.querySelectorAll('.partial');
    console.log(list[0].id);
    console.log(list[0].innerHTML);


    for (let i = 0; i < list.length; i++) {
      Handlebars.registerPartial(list[i].id, list[i].innerHTML);
    }
    console.log(list);
  }
}
