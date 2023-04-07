const jwt = require("jsonwebtoken");
const info = require("../config");

exports.generateToken = function generateToken(user) {
  const userinfo = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userinfo, info.config.jwt_secret, {
    expiresIn: "1h",
  });
  return token;
};

exports.verify = async function verify(ctx, next) {
  const authHeader = ctx.request.header.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { message: "No Token, empty Auth Header. You are not logged in"};
    return
  }
  const token = authHeader.split(" ")[1];
  try {
    const checkedToken = jwt.verify(token, info.config.jwt_secret, {
      ignoreExpiration: false,
    });
    ctx.state.user = checkedToken;
    await next();
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError"){
      ctx.status =  401;
      ctx.body = {error: "Token has Expired. Please Login again"}
    } else {
      ctx.status = 500;
      ctx.body = {error: "Unexpected Error" }
    }
  }
};
