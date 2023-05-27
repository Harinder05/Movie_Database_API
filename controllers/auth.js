const jwt = require("jsonwebtoken");
const info = require("../config");
const cookies = require("koa-cookies");

exports.generateToken = function generateToken(user) {
  const userinfo = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(userinfo, info.config.jwt_secret, {
    expiresIn: "1h",
  });
  return { token, userinfo };
};

exports.verify = async function verify(ctx, next) {
  /*
  const authHeader = ctx.request.header.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = {
      message: "No Token, empty Auth Header. You are not logged in",
    };
    return;
  }
  */
  //const token = authHeader.split(" ")[1];
  const token = ctx.cookies.get("token");
  console.log("Reached verify function");
  console.log(token);
  if (!token) {
    ctx.throw(401, "Unauthorized, No token/cookie.");
    return;
  }
  try {
    const checkedToken = jwt.verify(token, info.config.jwt_secret, {
      ignoreExpiration: false,
    });
    ctx.state.user = checkedToken;
    console.log(ctx.state.user);
    await next();
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      ctx.status = 401;
      ctx.body = { error: "Token has Expired. Please Login again" };
    } else {
      ctx.status = 500;
      ctx.body = { error: "Unexpected Error" };
    }
  }
};
