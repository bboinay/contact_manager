const FormManager = {
  receive: function(form) {
    let list = form.querySelectorAll("[type='text']");
  
    let inputs = {};
    for (let i = 0; i < list.length; i++) {
      let input = list[i];
      inputs[input.name] = input.value;
    }
  
    return inputs;
  }
}