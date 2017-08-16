const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  username: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  gameID: String
});

const gameSchema = mongoose.Schema({
  creator: String,
  creatorID: String,
  locations: Object,
  hints: Object,
  players: Object,
})

const User = mongoose.model('User', userSchema);
const Game = mongoose.model('Game', gameSchema);

module.exports = {
  User: User,
  Game: Game
};
