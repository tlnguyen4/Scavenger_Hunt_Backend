const express = require('express');
const app = express();
const models = require('../models/models');
const User = models.User;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.send('Heroku running!');
})

app.post('/register', function(req, res) {
  new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  }).save(function(err) {
    if (err) {
      res.send({
        register: false,
        error: err
      })
    } else {
      res.send({
        register: true,
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Backend server for Scavenger Hunt running on port 3000");
});
