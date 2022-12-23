const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;
const httpStatus = require("http-status");
const verifyToken = (req, res, next) => {
  // Get token from request header
  const token = req.headers["x-access-token"];
  // Check if token is available
  if (!token) {
    return res.status(httpStatus.FORBIDDEN).send({
      message: "Not Authorized",
    });
  }
  // Verify token and decode it
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: "Invalid token" });
  }

  return next();
};

module.exports = verifyToken;
