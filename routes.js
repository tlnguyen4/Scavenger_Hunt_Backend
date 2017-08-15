const express = require('express');
const app = express();
const models = require('./models/models');
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

app.post('/login', function(req, res) {
  console.log(req.body.username, req.body.password);
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      res.send({
        login: false,
        error: "User does not exist. Please sign up before logging in."
      });
    } else if (user) {
      if (user.password !== req.body.password) {
        res.send({
          login: false,
          error: "Wrong Password"
        });
      } else if (user.password === req.body.password) {
        res.send({
          login: true
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Backend server for Scavenger Hunt running on port 3000");
});
