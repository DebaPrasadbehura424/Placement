const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();

const authRoutes = require("./server/routes/auth");
const questionRoutes = require("./server/routes/questions");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/questions", questionRoutes); // ✅ add this line

mongoose
  .connect("mongodb://localhost:27017/Placement")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5500, () => console.log("Server running on port 5500"));
  })
  .catch((err) => console.error(err));
