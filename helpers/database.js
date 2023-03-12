const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connn = await mongoose.connect("mongodb://localhost/myapidb");
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
