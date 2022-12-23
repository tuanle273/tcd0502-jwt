const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const httpStatus = require("http-status");
const { TOKEN_KEY } = process.env;

const register = async (req, res) => {
  try {
    // Get Input from request body
    const { first_name, last_name, email, password } = req.body;
    console.log(first_name, last_name);
    // Validate Input
    if (!(email && password && last_name && first_name)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "All input must be valid" });
    }
    // Validate if user is already registered
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return res.status(httpStatus.BAD_REQUEST).send({
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
    return res.status(httpStatus.OK).send(user);
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "All required fields must be provided",
      });
    }
    // Validate if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: "User does not exist",
      });
    }
    // Validate password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Password is incorrect",
      });
    }
    // Generate a token
    const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
      expiresIn: "1h",
    });

    user.token = token;
    return res.status(httpStatus.OK).send(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
};
