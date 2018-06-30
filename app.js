const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const assert = require('assert');
const debug = require('debug')('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));


app.get("/", (req, res) => {
  debug("Received GET req on baseURL");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post('/login', (req, res) => {
  debug("Received POST req with PW: %o", req.body.password);
  if (req.body.password === "Raj"){
    fs.readFile("./raw/set1/set1.json", "utf-8", (err, data) => {
      assert.equal(err, null);
      res.json(data);
    })
  }
});


app.listen(port, function(){
  debug("Listening on PORT NO: %s", port);
});
