const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be empty"],
    },
    email: {
      type: String,
      required: [true, "Can't be empty"],
      unique: true,
      lowercase: true,
      index: true,
      validate: [isEmail, "Invslid Email"],
    },
    password: {
      type: String,
      required: [true, "Can't be empty"],
    },
    picture: {
      type: String,
    },
    messages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
  },
  {
    minimize: false,
  },
  {
    timestamps: true,
  }
);

const User =  mongoose.model('User' , UserSchema);
module.exports =  User;