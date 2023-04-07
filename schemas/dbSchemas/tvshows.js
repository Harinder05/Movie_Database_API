const mongoose = require("mongoose");

// Define the schema for the TVshow collection
const tvshowSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  network: { type: String, required: true },
  seasons: { type: Number, required: true },
  episodes: { type: Number, required: true },
  cast: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Celeb", required: true },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const TvshowModel = mongoose.model("Tvshows", tvshowSchema);

module.exports = TvshowModel;
