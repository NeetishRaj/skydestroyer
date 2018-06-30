const fs = require('fs');
const path = require('path');


const userPath = path.join(__dirname, "data", "user.json");


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
              users.push(userInfo);
              writeToFile(JSON.stringify(users, null, 2), callback);
            }
          } else {
            users.push(userInfo);
            writeToFile(JSON.stringify(users, null, 2), callback);
          }
        });
      }
    } else {
      // User.json file exists so we check first for existing username

      users = JSON.parse(data || "[]");
      const userMatch = users.
        find((item) => item.username === userInfo.username);

      if (typeof userMatch === "undefined"){
        // Username doesnt exists so we can add new user
        users.push(userInfo);
        writeToFile(JSON.stringify(users, null, 2), callback);

      } else {
        return callback({
          "message": "Given username already exists",
          "success": false
        });
      }
    }

    return userInfo;
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

      // If user exists then update the user content
      users[matchIndex] = Object.assign({}, users[matchIndex], newUserData);
      writeToFile(JSON.stringify(users, null, 2), callback);

      return true;
  });
}

insertUser({"username": "baba"}, (data) => {
  console.log(data.message);
});
isUserExist("bada", (isExists) => {

  if(isExists){
    console.log(isExists);
    console.log("exists");
  } else {
    console.log("doesnt exists");
  }
});

updateUser("gabbar", {
  "name": "supperdaddy",
  "score": 4545,
  "comments":[
    "You have done a great job",
    "but this is not cool"
  ]
}, (res) => {
  console.log(res.message);
})

module.exports = {
  insertUser,
  isUserExist,
  updateUser
}
