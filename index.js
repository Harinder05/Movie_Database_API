const Koa = require("koa");
const app = new Koa();
const connectDB = require("./helpers/database");

connectDB();

const users = require("./routes/user.js");
const movies = require("./routes/movies.js");

const tvshows = require("./routes/tvshows.js");
const cast = require("./routes/cast.js");
const genres = require("./routes/genres.js");

app.use(movies.routes());
app.use(users.routes());
//app.use(tvshows.routes());
//app.use(cast.routes());
//app.use(genres.routes());

let port = 3000;
app.listen(port);
console.log(`Server started on port ${port}`);
