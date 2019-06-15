/* eslint-disable */

// Request Handlers
var RH = (function(){
 
  var userValidateRegex = {
    "comments": /.+/g,
    "highScore": /^\d+$/,
    "lastProgress": /^\d+$/,
    "name": /^[a-zA-Z ]{3,20}$/,
    "password": /^.{5,20}$/,
    "sound": /^(true|false)$/,
    "username": /^[\w]{5,12}$/
  };

  const validateInput = function(userInput = {}){
    const defaultUserKeys = Object.keys(userValidateRegex);

    for(let key in userInput){
      if(!defaultUserKeys.includes(key) || 
        !userValidateRegex[key].test(userInput[key])) {
        return {
          invalidKey: key,
          success: false
        };
      }
    }

    return {
      invalidKey: null,
      success: true
    };
  }

  const handleUserRegister = function(form){

    const registerInput = {
      name: form.elements[0].value,
      username: form.elements[1].value,
      password: form.elements[2].value
    };
    const validate = validateInput(registerInput);


    if (validate.success) {
      Fetch.postData('/users', registerInput)
        .then((response) => {
          if(response.success){
            alert("Successfully Registered, Please Login now to start playing");
          } else {
            alert(response.message);
          }
        })
        .catch(() => {
          alert("Something happened in the Nodejs Server most probably, Please try again!");
        })
    } else {
      alert(`Invalid ${validate.invalidKey} input, Try again!`);
    }
  }


  return {
    handleUserRegister
  }
  
})()