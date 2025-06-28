const express = require("express");
const User = require("../model/User");

const router = express.Router();

router.patch("/toggle-question", async (req, res) => {
  const { userId, topic, questionId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const topicData = user.topics.find((t) => t.sub === topic);
    if (!topicData) return res.status(404).json({ msg: "Topic not found" });

    const question = topicData.ques.find((q) => q.id === questionId);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    question.solved = !question.solved;
    await user.save();

    res.json({ msg: "Updated", question });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
