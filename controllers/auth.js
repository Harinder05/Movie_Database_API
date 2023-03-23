const jwt = require("jsonwebtoken");
const info = require("../config");

exports.generateToken = function generateToken(user) {
  const userinfo = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userinfo, info.config.jwt_secret, {
    expiresIn: "30s",
  });
  return token;
};

exports.verify = async function verify(ctx, next) {
  const authHeader = ctx.request.header.authorization;
  if (!authHeader) {
    ctx.throw(401, "No token");
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
    ctx.status = err.status || 401;
    ctx.body = {
      message: err.message || "Token has Expired. Please Login again",
    };
  }
};
