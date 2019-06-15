const fs = require('fs');
const path = require('path');

// The path string for the user.json file
const userPath = path.join(__dirname, "data", "user.json");


// The default values and structure object of user
const defaultUser = {
  "comments": [],
  "highScore": 0,
  "lastProgress": 0,
  "name": "",
  "password": "",
  "sound": true,
  "username": ""
};


// The regex of input fields for server side validation
const userRegex = {
  "comments": /.+/g,
  "highScore": /^\d+$/,
  "lastProgress": /^\d+$/,
  "name": /^[a-zA-Z ]{3,20}$/,
  "password": /^.{5,20}$/,
  "sound": /^(true|false)$/,
  "username": /^[\w]{5,12}$/
};


/**
 * Validates the data received on the server side
 * Validation guidelines alre
 * 1. look for unwanted object keys
 * 2. match each input with its corresponding regex
 * @param {Object} userInfo the user object that needs to be validated.
 * @returns {Boolean} returns true or false based on the validation
 */
const validateUserInfo = function(userInfo){

  for (const key1 in userInfo) {
    if (!Object.keys(defaultUser).includes(key1) ||
      !userRegex[key1].test(userInfo[key1])) {

      return false;
    }
  }

  return true;
}


/**
 * A private method that actually inserts the given data to the user.json file.
 * @param {String} data the complete data to be written to file.
 * @param {Function} callback for calling it to perform the tasks
 * asynchronously.
 * @returns {Object} the user info and the success/failure message.
 */
const writeToFile = function(data, callback){
  fs.writeFile(userPath, data, (writeError) => {
    if (writeError){

      return callback({
        "message": "Write operations failed",
        "success": false
      });
    }
    callback({
      "message": "Write operations Successful",
      "success": true
    });

    return true;
  });
};


/**
 * Finds whether the user exists or not.
 * @param {String} username unique username to check existing user
 * @param {Function} callback callback to perform operations asynchronously
 * @returns {Boolean} returns false if doesnt exist or the user object if exists
 */
const isUserExist = function(username, callback){
  fs.readFile(userPath, "utf-8", (readErr, data) => {
      if (readErr){
        // Since there are errors in reading the file so data dont exist
        return callback(false);
      }

      // Find the first existence of user with username or undefined otherwise
      const user = JSON.parse(data || "[]").
        find((item) => item.username === username);

      if (typeof user === "undefined"){
        return callback(false);
      }

      // If user exists then send the user object
      callback(user);

      return true;
  });
}


/**
 * Inserts the user info to the user.json file.
 * @param {Object} userInfo contains the user info.
 * @param {Function} callback for calling it to perform the tasks
 * asynchronously.
 * @returns {Object} the user info and the success/failure message in callback.
 */
const insertUser = function(userInfo, callback){
  let users = [];
  const userObj = Object.assign({}, defaultUser, userInfo);

  fs.readFile(userPath, "utf-8", (readErr, data) => {
    if (readErr){

      // ENOENT is the fs error code when the given path does not exist
      if (readErr.code === "ENOENT"){

        fs.mkdir('data', (mkdirErr) => {

          if (mkdirErr){
            // EEXIST error code means that the 'data'path already exists
            if (mkdirErr.code === "EEXIST"){

              /*
               * Since the data folder already exists hence we ll proceed
               * with creating the file, like we would do without error
               */
              users.push(userObj);
              writeToFile(JSON.stringify(users, null, 2), callback);
            }
          } else {
            users.push(userObj);
            writeToFile(JSON.stringify(users, null, 2), callback);
          }
        });
      }
    } else {
      // User.json file exists so we check first for existing username

      users = JSON.parse(data || "[]");
      const userMatch = users.
        find((item) => item.username === userObj.username);

      if (typeof userMatch === "undefined"){
        // Username doesnt exists so we can add new user
        users.push(userObj);
        writeToFile(JSON.stringify(users, null, 2), callback);

      } else {
        return callback({
          "message": "Given username already exists",
          "success": false
        });
      }
    }

    return userObj;
  // End of readFIle()
  });
}


/**
 * Updates the user info to the user.json file for the given username.
 * @param {String} username the username that needs updating.
 * @param {Object} newUserData new object properties to be added to the user
 * @param {Function} callback to help perform the next task asynchronously.
 * @returns {Object} a task completion message on success/failure of update
 */
const updateUser = function(username, newUserData, callback){
  fs.readFile(userPath, "utf-8", (readErr, data) => {
      if (readErr){

        // Since there are errors in reading the file so data dont exist
        return callback({
          "message": "Requested username is not registered to Database",
          "success": false
        });
      }

      // Find the first existence of user with username or undefined otherwise
      const users = JSON.parse(data || "[]");
      const matchIndex = users.
        findIndex((item) => item.username === username);

      if (matchIndex === -1){
        // No match found in the collection
        return callback({
          "message": "Requested username is not registered to Database",
          "success": false
        });
      }

      // If user exists then update the user content after validation
      if (validateUserInfo(newUserData)){
        users[matchIndex] = Object.assign({}, users[matchIndex], newUserData);
        writeToFile(JSON.stringify(users, null, 2), callback);
      } else {
        return callback({
          "message": "Invalid properties in the payload object",
          "success": false
        })
      }

      return true;
  });
}


/**
 * Returns an exhaustive list of all the users Name and highscore in decreasing
 * order scraped from the main collection
 * @param {Function} callback to help perform the next task asynchronously.
 * @returns {Array} an array of objects with Names and highScores properties
 */
const getHighScores = function(callback){
  fs.readFile(userPath, "utf-8", (readErr, data) => {
      if (readErr){

        // Since there are errors in reading the file so data dont exist
        return callback({
          "message": "Cant provide high scores since cant access Database",
          "success": false
        });
      }

      // Now map-reduce the array to return only names and highScores
      const users = JSON.parse(data || "[]");
      const highScoresList = users.
        sort((first, second) => second.highScore - first.highScore).
        reduce((acc, item) => {
          acc.push({
            "highScore": item.highScore,
            "name": item.name
          });

          return acc;
        }, []);


      if (highScoresList.length === 0){
        // Collection is empty
        return callback({
          "message": "No High scores list, since Database is empty",
          "success": false
        }, highScoresList);
      }

      // If we there are non-zero user documents in collection
      callback({
        "message": "List of high Scores returned successfully",
        "success": true
      }, highScoresList);

      return highScoresList;
  });
}

module.exports = {
  getHighScores,
  insertUser,
  isUserExist,
  updateUser
};
