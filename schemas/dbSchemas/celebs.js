const mongoose = require("mongoose");

// Define the schema for the movies collection
const celebSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  nationality: { type: String, required: true },
  knownFor: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Movies", required: true },
  ],
});

const CelebModel = mongoose.model("Celeb", celebSchema);

module.exports = CelebModel;
