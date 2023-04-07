const Koa = require("koa");
const app = new Koa();
const connectDB = require("./helpers/database");
const mongoose = require("mongoose");
const cors = require("@koa/cors");

app.use(cors({
  origin: "http://localhost:3000",
}));
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