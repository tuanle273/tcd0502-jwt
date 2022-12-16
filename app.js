require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(express.json());

const { TOKEN_KEY } = process.env;

// Register
app.post("/register", async (req, res) => {
  try {
    // Get Input from request body
    const { first_name, last_name, email, password } = req.body;
    // Validate Input
    if (!(email && password && last_name && first_name)) {
      return res.status(400).send("All input must be valid");
    }
    // Validate if user is already registered
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return res.status(400).send("User already registered");
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

module.exports = app;
