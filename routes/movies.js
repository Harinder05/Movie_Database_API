const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Movies = require("../models/movies");

const prefix = "/api/v1/movies";
const router = Router({ prefix: prefix });

router.get("/", getAll);
router.post("/", bodyParser(), addMovie);
router.get("/:id", getById);
router.put("/:id", bodyParser(), updateMovie);
router.del("/:id", deleteMovie);

async function getAll(ctx) {
  try {
    const allmovies = await Movies.find().select("-__v");
    ctx.status = 200;
    ctx.response.body = allmovies;
  } catch (error) {
    console.log(error);
  }
}

async function addMovie(ctx) {
  let { title, description, releaseDate, cast, director } = ctx.request.body;
  if (!title) {
    ctx.throw(400, "Please enter title");
  }
  if (!description) {
    ctx.throw(400, "Please enter description");
  }
  if (!releaseDate) {
    ctx.throw(400, "Please enter releasedate");
  }
  if (!director) {
    ctx.throw(400, "Please enter director");
  }
  if (!cast) {
    ctx.throw(400, "Please enter cast");
  }

  cast = cast.split(",");
  const movieToAdd = await Movies.create({
    title,
    description,
    releaseDate,
    cast,
    director,
  });

  ctx.status = 201;
  ctx.body = movieToAdd;
}

async function getById(ctx) {
  try {
    let id = ctx.params.id;
    console.log(id);
    let result = await Movies.findById(id).select("-__v");

    if (!result) {
      //console.log('Not Found');
      ctx.throw(404, `Movie with ${id} is not found or does not exist`);
    }
    ctx.body = result;
  } catch (error) {
    console.log(error);
  }
}

async function updateMovie(ctx) {
  let result;
  try {
    const update = ctx.request.body;
    let id = ctx.params.id;
    result = await Movies.findById(id);

    if (!result) {
      console.log("Not Found");
      ctx.throw(404, `Movie with ${id} is not found or does not exist`);
    }
  } catch (error) {
    console.log(error);
  }
  // if new information is not complete reassign the old info
  result.title = update.title || result.title;
  result.description = update.description || result.description;
  result.director = update.director || result.director;
  result.releaseDate = update.releaseDate || result.releaseDate;
  result.cast = update.cast || result.cast;
  await result.save();

  ctx.body = result;
}
async function deleteMovie(ctx) {
  const id = ctx.params.id;
  const movieToDelete = Movies.findByIdAndDelete(id);

  if (!movieToDelete) {
    console.log("Movie not found");
    ctx.throw(404, `Movies with ${id} is not found or does not exist`);
  }

  ctx.status = 200;
  ctx.body = movieToDelete;
}

module.exports = router;
