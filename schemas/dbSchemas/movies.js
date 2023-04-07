const mongoose = require("mongoose");

// Define the schema for the movies collection
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  cast: [{ type: mongoose.Schema.Types.ObjectId, ref: "Celeb", required: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const MovieModel = mongoose.model("Movies", movieSchema);

module.exports = MovieModel;
