var fs = require('fs');
// var config = JSON.parse(fs.readFileSync('./data/config', encoding="ascii"));
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var path = require('path');
var request = require("request");

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// Credentials required!

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


// API
app.get('', function (req,res) {
  res.json("Good to go");
});


app.post('/sub', function (req, res) {
  console.log(req.body.name, req.body.email);
  // res.json(req.body.email);
  var addContactOptions = {
    method: 'POST',
    url: 'https://app.icontact.com/icp/a/201727/c/13584/contacts/',
    headers: credentials,
    body: [ { email: req.body.email, firstName: req.body.name } ],
    json: true
  };

  request(addContactOptions, function (error, response, body) {
    if (error) throw new Error(error);
    var contactId = response.body.contacts[0].contactId;
    console.log(response.body.contacts[0]);

    var subscribeOptions = { method: 'POST',
      url: 'https://app.icontact.com/icp/a/201727/c/13584/subscriptions/',
      headers: credentials,
      body: [ { contactId: contactId, listId: 40061, status: 'normal' } ],
      json: true
    };
    request(subscribeOptions, function (error, response, body) {
      console.log(response.body);
      res.json(response.body.subscriptions[0]);
    });
  });

});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});

module.exports = app; // for testing
