require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const httpStatus = require("http-status");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const ApiError = require("./utils/ApiError");
app.use(express.json());

// Cors
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Use Routes
app.use("/", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route Not Found"));
});

module.exports = app;
