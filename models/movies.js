const mongoose = require('mongoose');


// Define the schema for the movies collection
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    cast: { type: [String], required: true }
});


module.exports = mongoose.model('Movies', movieSchema)