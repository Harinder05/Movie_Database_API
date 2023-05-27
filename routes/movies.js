/**
 * @module Movies-Routes
 * @author Harinderveer Singh
 * @description Provides the routes and functions to manage the movies
 */

const Router = require("koa-router");
const path = require("path");
const bodyParser = require("koa-bodyparser");
const auth = require("../controllers/auth");
const model = require("../models/movies.js");
const can = require("../permissions/movies");
const axios = require("axios");
const multer = require("koa-multer");
const { paginate } = require("../controllers/special");
const { apikey } = require("../config").config;
const {
  validateNewMovie,
  validateUpdateMovie,
} = require("../controllers/validation");
const fs = require("fs");

const prefix = "/api/v1/movies";
const router = Router({ prefix: prefix });

const multerUpload = multer({ dest: "./uploads" });

//Public Routes
router.get("/db/search/:title", searchLocalDatabase);
router.get("/api/search/:title", searchIMDbAPI);
router.get("/", getAll);
router.get("/user-movies", auth.verify, getUserMovies);
router.get("/:id", getById);

//Protected Routes
router.post("/", bodyParser(), auth.verify, addMovie);

router.put("/:id", bodyParser(), auth.verify, updateMovie);
router.del("/:id", auth.verify, deleteMovie);
router.post(
  "/upload",
  bodyParser(),
  multerUpload.single("photos"),
  uploadPhoto
);

async function uploadPhoto(ctx) {
  const uploadedFiles = [];

  const { path, originalname } = ctx.req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  uploadedFiles.push(newPath.replace("uploads\\", ""));

  ctx.status = 200;
  ctx.body = { data: uploadedFiles };
}

async function searchLocalDatabase(ctx) {
  try {
    const title = ctx.params.title;

    const dbResult = await model.searchMovie(title);
    console.log(dbResult);

    if (dbResult.length > 0) {
      const pagenumber = ctx.query.page || 1;
      const itemsonpage = ctx.query.limit || 10;
      const paginatedResults = paginate(dbResult, pagenumber, itemsonpage);
      const totalCount = dbResult.length;

      console.log(paginatedResults);
      console.log(totalCount);

      ctx.status = 200;
      ctx.body = {
        movies: paginatedResults,
        totalCount: totalCount,
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        message:
          "No results found in the local database. Try searching on with API.",
      };
    }
  } catch (err) {
    ctx.status = err.status || 404;
    ctx.body = { message: err.message };
  }
}

async function searchIMDbAPI(ctx) {
  try {
    const title = ctx.params.title;

    const requestUrl = `https://imdb-api.com/en/API/SearchMovie/${apikey}/${title}`;
    const apiresponse = await axios.get(requestUrl);

    if (apiresponse.status !== 200) {
      ctx.throw(502, "Failed to get data from Third-Party API");
    }

    const results = apiresponse.data.results;
    console.log(results);
    if (results.length == 0) {
      ctx.status = 200;
      ctx.body = {
        movies: [],
        totalCount: 0,
      };
    } else {
      const pagenumber = ctx.query.page || 1;
      const itemsonpage = ctx.query.limit || 30;
      const paginatedResults = paginate(results, pagenumber, itemsonpage);
      const totalCount = results.length;

      ctx.status = 200;
      ctx.body = {
        movies: paginatedResults,
        totalCount: totalCount,
      };
      console.log(totalCount);
    }
  } catch (err) {
    ctx.status = err.status || 404;
    ctx.body = { message: err.message };
  }
}

/**
 * @function searchMovie
 * @async
 * @description Search for movie using the title given by user, first search the local database and if there is no result use third party api
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function searchMovie(ctx) {
  try {
    const title = ctx.params.title;
    const dbResult = await model.searchMovie(title);
    let finalResult;
    if (dbResult.length > 0) {
      finalResult = dbResult;
    } else {
      // Make request to third party api
      const requestUrl = `https://imdb-api.com/en/API/SearchMovie/${apikey}/${title}`;
      const apiresponse = await axios.get(requestUrl);
      // Unexpected Response
      if (apiresponse.status !== 200) {
        ctx.throw(502, "Failed to get data from Third Paty Api");
      }
      // Empty Response if input not good
      if (apiresponse.data.results.length == 0) {
        ctx.status = 200;
        ctx.body = {
          message: "No results found. Try searching a different movie",
        };
        return;
      }
      finalResult = apiresponse.data.results;
    }
    const pagenumber = ctx.query.page || 1;
    const itemsonpage = ctx.query.limit || 5;
    const paginatedResults = paginate(finalResult, pagenumber, itemsonpage);

    ctx.status = 200;
    ctx.body = paginatedResults;
  } catch (err) {
    //console.error(err.status,err.message)
    ctx.status = err.status || 404;
    ctx.body = { message: err.message };
  }
}

/**
 * @function getAll
 * @async
 * @description Find all the movies stored in local database
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function getAll(ctx) {
  try {
    const result = await model.getAll();

    const pagenumber = ctx.query.page || 1;
    const itemsonpage = ctx.query.limit || 30;
    const paginatedResults = paginate(result.message, pagenumber, itemsonpage);
    const totalCount = result.message.length;

    ctx.status = 200;
    ctx.body = {
      movies: paginatedResults,
      totalCount: totalCount,
    };
  } catch (error) {
    console.log(error);
  }
}
/**
 * @function getById
 * @async
 * @description Find the movies by the Id given by user from local database
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */

async function getById(ctx) {
  try {
    const id = ctx.params.id;
    const result = await model.getById(id);
    if (!result) {
      ctx.throw(404, `The ID ${id} does not match with any movie`);
    }
    ctx.status = 200;
    ctx.body = result;
  } catch (err) {
    console.log("IAM HERE");

    if (err.name === "CastError") {
      ctx.status = err.status || 400;
      ctx.body = { error: "Invalid ID! The ID must be 24 characters long" };
    } else {
      ctx.status = err.status || 500;
      ctx.body = {
        error:
          err.message ||
          "An unexpected error occurred. Please try again later.",
      };
    }
  }
}

async function getUserMovies(ctx) {
  try {
    const userId = ctx.state.user.id;
    console.log(userId);
    const result = await model.getUserMovies(userId);
    console.log(result);

    const pagenumber = ctx.query.page || 1;
    const itemsonpage = ctx.query.limit || 10;
    const paginatedResults = paginate(result.message, pagenumber, itemsonpage);
    const totalCount = result.message.length;

    ctx.status = 200;
    ctx.body = {
      movies: paginatedResults,
      totalCount: totalCount,
    };
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * @function addMovie
 * @async
 * @description Adds a movie to local database
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */

async function addMovie(ctx) {
  const token = ctx.cookies.get("token");
  if (!token) {
    ctx.body = { message: "No cookie token" };
    return;
  }
  try {
    const createrId = ctx.state.user.id;
    const body = ctx.request.body;
    const result = await model.addMovie(body, createrId);
    ctx.status = result.status;
    ctx.body = {
      message: {
        info: "New movie added to database successfully",
        //created: true,
        //link: `${ctx.request.path}/${result.message._id}`,
      },
    };
  } catch (err) {
    if (err.message === "duplicate") {
      ctx.status = 409;
      ctx.body = { error: "This movie is already in the database" };
    } else {
      console.error(err.message);
      ctx.status = 500;
      ctx.body = {
        error: "Could not add the movie. Unexpected error occurred.",
      };
    }
  }
}

/**
 * @function updateMovie
 * @async
 * @description Updates a movie by Id in local database
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function updateMovie(ctx) {
  try {
    const update = ctx.request.body;
    const id = ctx.params.id;
    const movieExists = await model.getById(id);
    const permission = can.update(ctx.state.user, movieExists);
    console.log(permission);
    if (!permission.granted) {
      ctx.status = 400;
      ctx.body = { message: "You are not allowed to update" };
      return;
    }
    result = await model.updateMovie(id, update);
    ctx.status = result.status;
    ctx.body = { message: { updated: true, info: result.message } };
    return;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Unexpected Error. Try again later" };
  }
}
/**
 * @function deleteMovie
 * @async
 * @description Deletes a movie by Id from local database
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function deleteMovie(ctx) {
  try {
    console.log("Delete Request");
    const permission = can.delete(ctx.state.user);
    console.log(permission);
    if (!permission.granted) {
      ctx.status = 400;
      ctx.body = { message: "You are not allowed to delete" };
      return;
    }
    const id = ctx.params.id;
    const result = await model.deleteMovie(id);
    ctx.status = result.status;
    ctx.body = { message: { deleted: true, info: result.message } };
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      ctx.status = 400;
      ctx.body = { error: "Invalid ID! The ID must be 24 characters long" };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: "An unexpected error occurred. Please try again later.",
      };
    }
  }
}

module.exports = router;
