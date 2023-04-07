const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const auth = require("../controllers/auth");
const model = require("../models/tvshows.js");
const can = require("../permissions/tvshows.js");
const axios = require("axios");
const { paginate } = require("../controllers/special");
const { apikey } = require("../config").config;
const {validateNewTvshow,validateUpdateTvshow} = require("../controllers/validation");

const prefix = "/api/v1/tvshows";
const router = Router({ prefix: prefix });

//Public Routes
router.get("/", getAll);
router.get("/:id", getById);
router.get("/search/:title", searchTvshow);

//Protected Routes
router.post("/", auth.verify, bodyParser(), validateNewTvshow, addTvshow);
router.put("/:id", auth.verify, bodyParser(), validateUpdateTvshow, updateTvshow);
router.del("/:id", auth.verify, deleteTvshow);

async function getAll(ctx) {
  try {
    const result = await model.getAll();
    const pagenumber = ctx.query.page || 1;
    const itemsonpage = ctx.query.limit || 5;
    const paginatedResults = paginate(result.message, pagenumber, itemsonpage);

    ctx.status = 200;
    ctx.body = paginatedResults;
  } catch (error) {
    console.log(error);
  }
}

async function getById(ctx) {
  try {
    const id = ctx.params.id;
    const result = await model.getById(id);
    if (!result) {
      ctx.throw(404, `The ID ${id} does not match with any tvshow`);
    }
    ctx.status = 200;
    ctx.body = result;
  } catch (err) {
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

async function searchTvshow(ctx) {
  try {
    const title = ctx.params.title;
    const dbResult = await model.searchTvshow(title);
    let finalResult;
    if (dbResult.length > 0) {
      finalResult = dbResult;
    } else {
      // Make request to third party api
      const requestUrl = `https://imdb-api.com/en/API/SearchSeries/${apikey}/${title}`;
      const apiresponse = await axios.get(requestUrl);
      // Unexpected Response
      if (apiresponse.status !== 200) {
        ctx.throw(502, "Failed to get data from Third Paty Api");
      }
      // Empty Response if input not good
      if (apiresponse.data.results.length == 0) {
        ctx.status = 200;
        ctx.body = {
          message: "No results found. Try searching a different tvshow",
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

async function addTvshow(ctx) {
  try {
    const createrId = ctx.state.user.id;
    const body = ctx.request.body;
    const result = await model.addTvshow(body, createrId);
    ctx.status = result.status;
    ctx.body = {
      message: {
        info: "New tvshow added to database successfully",
        created: true,
        link: `${ctx.request.path}/${result.message._id}`,
      },
    };
  } catch (err) {
    if (err.message === "duplicate") {
      ctx.status = 409;
      ctx.body = { error: "This tvshow is already in the database" };
    } else {
      console.error(err.message);
      ctx.status = 500;
      ctx.body = {
        error: "Could not add the tvshow. Unexpected error occurred.",
      };
    }
  }
}

async function updateTvshow(ctx) {
  try {
    
    const update = ctx.request.body;
    const id = ctx.params.id;
    const tvshowExists = await model.getById(id);
    const permission = can.update(ctx.state.user, tvshowExists);
    if (!permission.granted) {
      ctx.status = 400;
      ctx.body = { message: "You are not allowed to update" };
      return;
    }
    result = await model.updateTvshow(id, update);
    ctx.status = result.status;
    ctx.body = { message: { updated: true, info: result.message } };
    return;
  } catch (error) {
    console.error(err.message)
    ctx.status = 500;
    ctx.body = { error: "Unexpected Error. Try again later" };
  }
}

async function deleteTvshow(ctx) {
  try {
    const permission = can.delete(ctx.state.user);

    if (!permission.granted) {
      ctx.status = 400;
      ctx.body = { message: "You are not allowed to delete" };
      return;
    }
    const id = ctx.params.id;
    const result = await model.deleteTvshow(id);
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