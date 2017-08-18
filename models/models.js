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
  gameID: String,
  gameProgress: Object,
  progressIndex: Number
});

const gameSchema = mongoose.Schema({
  creator: String,
  creatorID: String,
  locations: Array,
  players: Array,
})

const User = mongoose.model('User', userSchema);
const Game = mongoose.model('Game', gameSchema);

module.exports = {
  User: User,
  Game: Game
};
