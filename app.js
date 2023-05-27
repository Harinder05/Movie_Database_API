const Koa = require("koa");
const send = require("koa-send");
const path = require("path");
const app = new Koa();
const connectDB = require("./helpers/database");
const mongoose = require("mongoose");
const cors = require("@koa/cors");

app.use(async (ctx, next) => {
  if (ctx.path.startsWith("/uploads")) {
    const filePath = ctx.path.replace("/uploads", "");
    await send(ctx, filePath, { root: path.join(__dirname, "uploads") });
  } else {
    await next();
  }
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
connectDB();

const users = require("./routes/user.js");
const movies = require("./routes/movies.js");
const tvshows = require("./routes/tvshows.js");
const celebs = require("./routes/celebs.js");

app.use(movies.routes());
app.use(users.routes());
app.use(tvshows.routes());
app.use(celebs.routes());

mongoose.connection.on("error", (err) => {
  console.log(err);
  console.log(err.no);
  console.log(err.code);
});

module.exports = app;
