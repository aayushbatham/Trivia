const express = require("express");
const authRoute = require("./routes/auth");
const quizRoute = require("./routes/quiz");
const userRoute = require("./routes/user");
require("dotenv").config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT;
app.use(express.json());
require("./db/db");

app.use(cors());

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/quiz", quizRoute);

app.get("/", (req, res) => {
  res.send("working!!");
});

app.listen(PORT, () => {
  console.log("server running at port", PORT);
});
