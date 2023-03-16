const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const model = require("../models/user.js");

const prefix = "/api/v1/user";
const router = Router({ prefix: prefix });

router.get("/", getAll);
router.post("/register", bodyParser(), registerUser);
router.post("/login", bodyParser(), loginUser);
router.patch("/:id", bodyParser(), updateUser);
router.delete("/:id", deleteUser);

async function getAll(ctx) {
  let result = await model.getAll();
  ctx.status = result.status;
  ctx.body = { message: result.message };
}

async function registerUser(ctx) {
  let body = ctx.request.body;
  let result = await model.registerUser(body);
  ctx.status = result.status;
  ctx.body = { message: result.message };
}

async function loginUser(ctx) {
  let body = ctx.request.body;
  let result = await model.loginUser(body);
  ctx.status = result.status;
  ctx.body = { message: result.message };
}
async function updateUser(ctx) {
  let body = ctx.request.body;
  let id = ctx.params.id;
  let result = await model.updateUser(body, id);
  ctx.status = result.status;
  ctx.body = { message: result.message };
}
async function deleteUser(ctx) {
  let id = ctx.params.id;
  let result = await model.deleteUser(id);
  ctx.status = result.status;
  ctx.body = { message: result.message };
}

module.exports = router;
