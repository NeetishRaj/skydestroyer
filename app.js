const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;
const path = require('path');

const data = require('./user.js');

const errorMessages = {
  "DNF": "Requested data not found try again please",
  "PNF": "Incorrect password entered",
  "RUNA": "Requested username is already taken so try something else",
  "UNF": "Requested user is not registered, Please register first then Login"
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));
app.use(express.static('public'))

app.get("/", (req, res) => {
  debug("Received GET req on baseURL");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/highscores", (req, res) => {
  data.getHighScores((dataRes, highScores) => {
    if (dataRes.success) {
      res.json(highScores);
    } else {
      res.json(dataRes);
    }
  });
});

app.post('/users', (req, res) => {
  data.isUserExist(req.body.username, (user) => {
    if (user){
      res.json({
        "message": errorMessages.RUNA,
        "success": false
      })
    } else {
      data.insertUser(req.body, (insertRes) => {
        res.json(insertRes);
      });
    }
  })
});


app.post('/login', (req, res) => {
  data.isUserExist(req.body.username, (user) => {
    if (user){
      if (req.body.password === user.password){
        res.json(user);
      } else {
        res.json({
          "message": errorMessages.PNF,
          "success": false
        });
      }
    } else {
      res.json({
        "message": errorMessages.UNF,
        "success": false
      });
    }
  });
});

app.put('/users/:uname', (req, res) => {
  debug("Received PUT req with Username: %o", req.params.uname);
  data.isUserExist(req.params.uname, (user) => {
    if (user){
      data.updateUser(req.params.uname, req.body, (updateRes) => {
        res.json(updateRes);
      });
    } else {
      res.json({
        "message": errorMessages.UNF,
        "success": false
      });
    }
  });
});


app.listen(port, function(){
  debug("Listening on PORT NO: %s", port);
});
