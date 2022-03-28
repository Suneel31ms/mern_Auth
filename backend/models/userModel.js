const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a Name"],
    },
    email: {
      type: String,
      required: [true, "Please add a Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
    },
    city: {
      type: String,
      required: [true, "Please add a City"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
