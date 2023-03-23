const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const model = require("../models/user.js");
const auth = require("../controllers/auth");
const can = require("../permissions/user");
const {isAdmin} = require ("../controllers/special")

const prefix = "/api/v1/user";
const router = Router({ prefix: prefix });

router.get("/all", auth.verify, isAdmin, getAll)
router.post("/register", bodyParser(), registerUser);
router.post("/login", bodyParser(), loginUser);
router.get("/:id", auth.verify, bodyParser(), getProfileInfo)
router.patch("/:id", bodyParser(), updateUser);
router.delete("/:id", deleteUser);


async function getProfileInfo(ctx) {
  const id = ctx.state.user.id;
  const result = await model.getById(id);
  
  if (result){
    const data = result.toObject();
    data._id = data._id.toString();
    const permission = can.read(ctx.state.user,data);
    if (!permission.granted) {
      ctx.throw(403, "Not ALLOWED");
    }else{
      ctx.status = 200;
      ctx.body = permission.filter(data)
    }
    
  }
}

async function getAll(ctx) {
  try {
    const result = await model.getall();
    ctx.status = 200;
    ctx.body = result;
  } catch (err) {
    console.error(err.status, err.message);
    ctx.throw(err.status, err.message);
  }
}

async function registerUser(ctx) {
  try {
    await model.registerUser(ctx);
  } catch (err) {
    //ctx.status = err.status;
    //ctx.body = {message: err.message};
    console.error(err.status, err.message);
    ctx.throw(err.status, err.message);
  }
}

async function loginUser(ctx) {
  try {
    await model.loginUser(ctx);
  } catch (err) {
    console.error(err.status, err.message);
    ctx.throw(err.status, err.message);
  }
}
async function updateUser(ctx) {
  try {
    await model.updateUser(ctx);
  } catch (err) {
    console.error(err.status, err.message);
    ctx.throw(err.status, err.message);
  }
}
async function deleteUser(ctx) {
  try {
    await model.deleteUser(id);
  } catch (err) {
    console.error(err.status, err.message);
    ctx.throw(err.status, err.message);
  }
}



module.exports = router;
