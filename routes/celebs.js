const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const auth = require("../controllers/auth");
const model = require("../models/celebs.js");
const { paginate } = require("../controllers/special");

const {validateCeleb} =require("../controllers/validation")

const prefix = "/api/v1/celebs";
const router = Router({ prefix: prefix });

//Public Routes
router.get("/", getAll);
router.get("/:id", getById);

//Protected Routes
router.post("/",auth.verify, bodyParser(),validateCeleb, addCeleb);
router.put("/:id",auth.verify, bodyParser(),validateCeleb, updateCeleb);
router.del("/:id",auth.verify, deleteCeleb);


async function getAll(ctx) {
  try {
    result = await model.getAll();
    ctx.status = result.status;
    ctx.body = { message: result.message };
  } catch (error) {
    console.log(error);
  }
}

async function getById(ctx) {
  try {
    const id = ctx.params.id;
    const result = await model.getById(id);
    ctx.status = result.status;
    ctx.body = { message: result.message };
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

async function addCeleb(ctx) {
  try {
    const body = ctx.request.body;
    const result = await model.addCeleb(body);
    if (result.status === 200) {
      ctx.status = 200;
      ctx.body = {
        message: "New Celebrity added to database successfully",
        created: true,
        link: `${ctx.request.path}/${result.id}`,
      };
    } else {
      ctx.status = result.status;
      ctx.body = { message: result.message };
    }
  } catch (err) {
    console.error(err.message);
    ctx.status = 500;
    ctx.body = {
      error: "Could not add the celebrity. Unexpected error occurred.",
    };
  }
}

async function updateCeleb(ctx) {
  try {
    const update = ctx.request.body;
    const id = ctx.params.id;
    result = await model.updateCeleb(id, update);
    ctx.status = result.status;
    ctx.body = {message: result.message};
  } catch (err) {
    if (err.name === "CastError") {
      ctx.status = 400;
      ctx.body = { error: "Invalid ID! The ID must be 24 characters long" };
    } else {
      ctx.status = 500;
      ctx.body = {
        error:
          "An unexpected error occurred. Please try again later.",
      };
    }
  }
}

async function deleteCeleb(ctx) {
  try {
    const id = ctx.params.id;
    const result = await model.deleteCeleb(id);
    ctx.status = result.status;
    ctx.body = { message: result.message };
  } catch (err) {
    if (err.name === "CastError") {
      ctx.status = 400;
      ctx.body = { error: "Invalid ID! The ID must be 24 characters long" };
    } else {
      ctx.status = 500;
      ctx.body = {
        error:
          "An unexpected error occurred. Please try again later.",
      };
    }
  }
}

module.exports = router;
