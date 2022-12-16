const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

mongoose.set("strictQuery", false);
exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connected ...");
    })
    .catch((error) => {
      console.error("Database Connected error: " + error);
      process.exit(1);
    });
};
