const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  id: String,
  text: String,
  solved: { type: Boolean, default: false },
  difficulty: String,
});
const topicSchema = new mongoose.Schema({
  sub: String,
  ques: [questionSchema],
});
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  topics: [topicSchema],
});
module.exports = mongoose.model("User", userSchema);
