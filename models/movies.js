/**
 * @module Movies-Models
 * @author Harinderveer Singh
 * @description Provides access to database for managing movies
 */

const Movies = require("../schemas/dbSchemas/movies");


/**
 * @function searchMovie
 * @async
 * @description Search for movie in database
 * @param {string} title - Given by user
 * @returns {Promise<Array>} List of movie(s) matching the title
 */
async function searchMovie(title) {
  const data = await Movies.find({ title: new RegExp(title, "i") })
    .select("-__v")
    .populate("cast", "name");
  return data;
}

/**
 * @function getAll
 * @async
 * @description Search for all the movies in database
 * @returns {Promise<Object>} List of all the movies
 */
async function getAll() {
  const data = await Movies.find()
    .select("-__v")
    .populate([
      { path: "cast", select: "name -_id" },
      { path: "createdBy", select: "name -_id" },
      { path: "updatedBy", select: "name -_id" },
    ]);
  if (!data) {
    return { status: 404, message: "No movies in database" };
  }
  return { status: 200, message: data };
}

/**
 * @function getById
 * @async
 * @description Search for specific movie by its Id in database
 * @param {string} id - Given by user, Id used to retrieve the movie
 * @returns {Promise<Object>} The movie that matches with ID
 */
async function getById(id) {
  const data = await Movies.findById(id)
    .select("-__v")
    .populate("cast", "name")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");
  return data;
}

/**
 * @function addMovie
 * @async
 * @description Adds a movie to database
 * @param {Object} body - Data of movie to add 
 * @param {string} createrId - Retreieved from the token, Id of the user who added the movie in database
 * @returns {Promise<Object>} Object with status code and message about the added movie
 * @throws {Error} If movie being added is already in database
 */
async function addMovie(body, createrId) {
  let { title, description, releaseDate, cast, director } = body;
  console.log(cast);

  const duplicate = await Movies.findOne({ title, releaseDate, director });
  if (duplicate) {
    throw new Error("duplicate");
  }

  const data = await Movies.create({
    title,
    description,
    releaseDate,
    cast,
    director,
    createdBy: createrId,
    updatedBy: createrId,
  });

  if (!data) {
    return { status: 400, message: "Could not add movie. Try later" };
  }

  return { status: 201, message: data };
}

/**
 * @function updateMovie
 * @async
 * @description Updates a movie in database
 * @param {Object} body - Data of movie to update
 * @param {string} id - Given by user, Id of the movie to be updated
 * @returns {Promise<Object>} Object with status code and message about the updated movie
 */
async function updateMovie(id, update) {
  let { title, description, releaseDate, cast, director } = update;

  const data = await Movies.findById(id);

  data.title = title || data.title;
  data.description = description || data.description;
  data.director = director || data.director;
  data.releaseDate = releaseDate || data.releaseDate;
  data.cast = cast || data.cast;
  await data.save();
  return { status: 201, message: data };
}

/**
 * @function deleteMovie
 * @async
 * @description Deletes a movie from database
 * @param {string} id - Given by user, Id of the movie to be deleted
 * @returns {Promise<Object>} Object with status code and message about the deleted movie
 */
async function deleteMovie(id) {
  const movie = await Movies.findById(id);
  if (!movie) {
    return { status: 400, message: "Movie not found. Check ID." };
  }
  const result = await Movies.findByIdAndDelete(id);
  return { status: 200, message: `The movie ${result.title} has been deleted` };
}

module.exports = {
  searchMovie,
  getAll,
  getById,
  addMovie,
  updateMovie,
  deleteMovie,
};
