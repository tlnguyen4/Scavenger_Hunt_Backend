const express = require('express');
const app = express();
const models = require('./models/models');
const User = models.User;
const Game = models.Game;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
  }).save(function(err, user) {
    if (err) {
      res.send({
        register: false,
        error: err
      })
    } else {
      res.send({
        register: true,
        user: user
      });
    }
  });
});

app.post('/login', function(req, res) {
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
        if (user.gameID) {
          Game.findById(user.gameID, function(err, game) {
            res.send({
              login: true,
              user: user,
              game: game,
            });
          });
        } else {
          res.send({
            login: true,
            user: user,
            game: null
          });
        }
      }
    }
  });
});

app.post('/newHunt', function(req, res) {
  new Game({
    creator: req.body.creator,
    creatorID: req.body.creatorID,
    locations: [],
    players: []
  }).save(function(err, game) {
    if (err) {
      res.send({
        created: false,
        error: "Cannot create new game"
      })
    } else {
      User.findById(req.body.creatorID, function(err, user) {
        user.gameID = game._id;
        user.save(function(err) {
          if (err) {
            res.send({
              created: false,
              error: "Cannot save new data to user."
            })
          } else {
            res.send({
              created: true,
              game: game
            });
          }
        });
      });
    }
  });
});

app.post('/addLocation', function(req, res) {
  Game.findById(req.body.gameID, function(err, game) {
    var updateLocations = game.locations;
    updateLocations.push({name: req.body.locationName, hint: req.body.locationHint});
    game.locations = updateLocations;
    game.save(function(err, game2) {
      if (err) {
        res.send({
          added: false,
          error: "Cannot add location in route."
        })
      } else {
        res.send({
          added: true,
          locations: game2.locations,
        })
      }
    })
  })
})

app.post('/getLocations', function(req, res) {
  Game.findById(req.body.gameID, function(err, game) {
    if (err) {
      res.send({
        retrieved: false,
        error: "Cannot find game."
      })
    } else {
      res.send({
        retrieved: true,
        locations: game.locations,
        players: game.players
      })
    }
  })
})

app.post('/deleteHunt', function(req, res) {
  Game.findById(req.body.gameID, function(err, game) {
    var playerArray = game.players;
    playerArray.push(req.body.creatorID);
    removeGameFromPlayer(playerArray)
      .then(updatedPlayerObject => {
        Game.remove({_id: req.body.gameID});
        res.send({
          deleted: true
        })
      })
  })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Backend server for Scavenger Hunt running on port 3000");
});

const removeGameFromPlayer = function(playerArray) {
  return new Promise(function(resolve, reject) {
    var playerPromise = playerArray.map(function(id) {
      return User.findById(id).exec();
    })
    Promise.all(playerPromise)
      .then(playerObjects => {
        playerObjects.map(eachObject => {
          eachObject.game = '';
          eachObject.save(function(err, updatedPlayer) {
            if (err) {
              reject(err);
            } else {
              resolve(updatedPlayer);
            }
          })
        })
      })
      .catch(err => {
        reject(err);
      });
  });
}
