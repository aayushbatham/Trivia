const mongoose = require("mongoose");

MONGOURI = process.env.MONGOURI;

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch();

module.exports = mongoose;
