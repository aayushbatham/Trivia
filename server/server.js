const express = require("express");
const authRoute = require("./routes/auth");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
require("./db/db");

app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("working!!");
});

app.listen(PORT, () => {
  console.log("server running at port", PORT);
});
