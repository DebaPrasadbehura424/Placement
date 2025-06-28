const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./server/routes/auth");
const questionRoutes = require("./server/routes/questions");

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "https://placement-frontend-theta.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);
app.get("/", (_, res) => {
  res.send("app is ready");
});

app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);

mongoose
  .connect(
    "mongodb+srv://debaprasadbehura89:s5dY5LSzdhymR4AB@cluster0.9chhe.mongodb.net/PlacementCenter?retryWrites=true&w=majority&appName=Cluster0;"
  )
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5500, () => console.log("Server running on port 5500"));
  })
  .catch((err) => console.error(err));
