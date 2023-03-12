const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { Code } = require("mongodb");

const bcryptSalt = bcrypt.genSaltSync(10);

const prefix = "/api/v1/user";
const router = Router({ prefix: prefix });

router.post("/register", bodyParser(), registerUser);
router.post("/login", bodyParser(), loginUser);

function hashpassword(password, salt) {
  return bcrypt.hashSync(password, salt);
}

async function registerUser(ctx) {
  let { name, email, password } = ctx.request.body;
  try {
    const hashedpassword = hashpassword(password, bcryptSalt);
    const usercreated = await User.create({
      name: name,
      email: email,
      password: hashedpassword,
    });
    ctx.status = 200;
    ctx.body = {
      message: "Registration completed. Please login",
    };
  } catch (error) {
    ctx.status = 400;
    console.log(error);
    ctx.body = {
      message: `Error. ${error.message}`,
    };
  }
}

async function loginUser(ctx) {
  const { email, password } = ctx.request.body;
  const userExists = await User.findOne({ email });
  // check if user exists in database
  if (userExists) {
    // check if password is correct
    const checkPassword = bcrypt.compareSync(password, userExists.password);
    // if password is correct
    if (checkPassword) {
      ctx.status = 200;
      ctx.body = {
        message: "Login successful",
      };
      // if password is not correct
    } else {
      ctx.status = 401;
      ctx.body = {
        message: "Email or Password are not correct.",
      };
    }
    // if user is not registered
  } else {
    ctx.status = 404;
    ctx.body = {
      message: "The user is not registered. Please register!",
    };
  }
}

module.exports = router;
