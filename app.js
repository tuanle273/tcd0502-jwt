require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(express.json());
const auth = require("./middleware/auth");

const { TOKEN_KEY } = process.env;

// Register
app.post("/register", async (req, res) => {
  try {
    // Get Input from request body
    const { first_name, last_name, email, password } = req.body;
    console.log(first_name, last_name);
    // Validate Input
    if (!(email && password && last_name && first_name)) {
      return res.status(400).send({ message: "All input must be valid" });
    }
    // Validate if user is already registered
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return res.status(400).send({
        message: "User already registered",
      });
    }
    // Encrypt password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    // Create a new Token
    const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
      expiresIn: "1h",
    });

    user.token = token;
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

// Login
app.post("/login", async (req, res) => {
  // Get user input
  const { email, password } = req.body;
  // Validate user input
  if (!(email && password)) {
    return res.status(400).send({
      message: "All required fields must be provided",
    });
  }
  // Validate if user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send({
      message: "User does not exist",
    });
  }
  // Validate password
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({
      message: "Password is incorrect",
    });
  }
  // Generate a token
  const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
    expiresIn: "1h",
  });

  user.token = token;
  return res.status(200).send(user);
});

// Welcome
app.get("/welcome", auth, (req, res) => {
  return res.status(200).send(req.user);
});

module.exports = app;
