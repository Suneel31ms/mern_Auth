const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const UserDB = require("../models/userModel");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, city } = req.body;
  if (!name || !email || !password || !city) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  //Check if user exists
  const userExists = await UserDB.findOne({ email: email });
  if (userExists) {
    res.status(400);
    throw new Error("User Aleardy Exists");
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await UserDB.create({
    name,
    email,
    password: hashedPassword,
    city,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields ");
  }
  //Check for user Email
  const user = await UserDB.findOne({ email: email });
  if (user) {
    const isMatchPass = await bcrypt.compare(password, user.password);
    if (isMatchPass) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// @desc    Get user data
// @route   POST /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};
