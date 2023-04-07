/**
 * @module User-Routes
 * @author Harinderveer Singh
 * @description Provides the routes and functions to manage the user
 */

const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const model = require("../models/user.js");
const auth = require("../controllers/auth");
const can = require("../permissions/user");
const { validateUser } = require("../controllers/validation");
const prefix = "/api/v1/user";
const router = Router({ prefix: prefix });

//Public Routes
router.post("/register", bodyParser(), validateUser, registerUser);
router.post("/login", bodyParser(), loginUser);

//Protected Routes
router.get("/all", auth.verify, getAll);
router.get("/info", auth.verify, getProfileInfo);
router.put("/:id", auth.verify, bodyParser(), validateUser, updateUser);
router.delete("/:id", auth.verify, deleteUser);


/**
 * @function getProfileInfo
 * @async
 * @description Finds information associated to the user
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function getProfileInfo(ctx) {
  const id = ctx.state.user.id;
  const result = await model.getById(id);
  if (result) {
    const data = result.toObject();
    data._id = data._id.toString();
    const permission = can.read(ctx.state.user, data);
    if (!permission.granted) {
      ctx.throw(403, "Permission Denied.");
    } else {
      ctx.status = 200;
      ctx.body = permission.filter(data);
    }
  }
}

/**
 * @function getProfileInfo
 * @async
 * @description Finds all users
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function getAll(ctx) {
  try {
    const permission = can.readAll(ctx.state.user);
    if (!permission.granted) {
      ctx.throw(403, "Permission Denied. This role is not allowed to access");
    }
    const result = await model.getall();
    ctx.status = result.status;
    ctx.body = { message: result.message };
  } catch (err) {
    ctx.throw(err.status || 500, err.message || "Unexpected Error. Try later");
  }
}

/**
 * @function getProfileInfo
 * @async
 * @description Registers a new user in database
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function registerUser(ctx) {
  try {
    const body = ctx.request.body;
    const result = await model.registerUser(body);
    ctx.status = result.status;
    if (result.status === 201){
      ctx.body = { message: { created: true, info: result.message } };
    }else{
      ctx.body = { message: result.message };
    }
  } catch (err) {
    ctx.throw(500, "Unexpected Error. Try later");
  }
}

/**
 * @function getProfileInfo
 * @async
 * @description Provides login for user
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function loginUser(ctx) {
  try {
    const body = ctx.request.body;
    const result = await model.loginUser(body);
    ctx.status = result.status;
    ctx.body = { message: result.message };
  } catch (err) {
    ctx.throw(500, "Unexpected Error. Try later");
  }
}

/**
 * @function getProfileInfo
 * @async
 * @description Updates information associated to the user
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function updateUser(ctx) {
  try {
    const requester = ctx.state.user;

    const id = ctx.params.id;
    const res = await model.getById(id);

    const owner = res.toObject();
    owner._id = owner._id.toString();

    const permission = can.update(requester, owner);

    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = {
        message:
          "You are not the owner of the account, you are trying to update",
      };
      return;
    }

    const body = ctx.request.body;
    const result = await model.updateUser(id, body);
    ctx.status = result.status;
    ctx.body = { message: result.message };
  } catch (err) {
    if (err.name === "CastError") {
      ctx.status = 400;
      ctx.body = { error: "Invalid ID! The ID must be 24 characters long" };
    } else if (err.code === 11000) {
      ctx.status = 400;
      ctx.body = { error: "Duplicate Error" };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: "An unexpected error occurred. Please try again later.",
      };
    }
  }
}


/**
 * @function getProfileInfo
 * @async
 * @description Deletes a user
 * @param {Object} ctx - Koa context
 * @throws {Error} Can throw error if there is issue with request/response
 */
async function deleteUser(ctx) {
  try {
    const requester = ctx.state.user;

    const id = ctx.params.id;
    const res = await model.getById(id);

    const owner = res.toObject();
    owner._id = owner._id.toString();

    const permission = can.delete(requester, owner);

    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = { message: "Permission Denied." };
      return;
    }

    const result = await model.deleteUser(id);
    ctx.status = result.status;
    ctx.body = { message: result.message };
  } catch (err) {
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
