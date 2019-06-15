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
          alert("Something might have happened with your Network, Please try again!");
        })
    } else {
      alert(`Invalid ${validate.invalidKey} input, Try again!`);
    }
  }

  const handleLogin = function(form){

    const loginInput = {
      username: form.elements[0].value,
      password: form.elements[1].value
    };

    Fetch.postData('/login', loginInput)
      .then((response) => {
        if(response.username !== undefined){
          smoothScroll(qs('.menuPage'));
          window.userToken = response;
        } else {
          alert(response.message);
        }
      })
      .catch(() => {
        alert("Something might have happened with your Network, Please try again!");
      })
  }

  const handleHighScore  = function(){
    
    Fetch.getData('/highscores')
      .then((scoreList) => {
        if(Array.isArray(scoreList) && scoreList.length > 0){
          DM.createScoreList(scoreList);
          smoothScroll(qs('.highScoresPage'));
        } else {
          alert(scoreList.message);
        }
      })
      .catch(() => {
        alert("Something might have happened with your Network, Please try again!");
      })
  }


  return {
    handleUserRegister,
    handleLogin,
    handleHighScore
  }

})()