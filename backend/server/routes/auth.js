const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const {
  Arrays1,
  Arrays2,
  ArraysMaths,
  AdditionalProblems,
  Hashing,
  LinkedList1,
  LinkedList2,
  LinkedListTwoPointer,
  Greedy,
  Graph1,
  Graph2,
  Recursion,
  Backtracking,
  BinarySearch1,
  BinarySearch2,
  BinarySearchTree1,
  BinarySearchTree2,
  BinaryTree1,
  BinaryTree2,
  BinaryTree3,
  Heaps,
  StackQueue1,
  StackQueue2,
  String1,
  String2,
  DynamicProgramming1,
  DynamicProgramming2,
  DynamicProgramming3,
  DynamicProgramming4,
  Trie,
  A
} = require("../data/questions");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      email,
      username,
      password,
      topics: [
        Arrays1,
        Arrays2,
        ArraysMaths,
        AdditionalProblems,
        Hashing,
        LinkedList1,
        LinkedList2,
        LinkedListTwoPointer,
        Greedy,
        Graph1,
        Graph2,
        Recursion,
        Backtracking,
        BinarySearch1,
        BinarySearch2,
        BinarySearchTree1,
        BinarySearchTree2,
        BinaryTree1,
        BinaryTree2,
        BinaryTree3,
        Heaps,
        StackQueue1,
        StackQueue2,
        String1,
        String2,
        DynamicProgramming1,
        DynamicProgramming2,
        DynamicProgramming3,
        DynamicProgramming4,
        Trie,
      ],
    });

    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id },
      "jljiouweweldnwoijwniochonoiehowjewnonw"
    );
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
