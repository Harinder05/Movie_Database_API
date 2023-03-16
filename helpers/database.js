const mongoose = require("mongoose");
const info = require("../config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(info.config.db);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
