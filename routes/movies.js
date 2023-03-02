const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const prefix = '/api/v1/movies';
const router = Router({prefix:prefix});



router.get('/', getAll);
router.post('/',bodyParser(), addMovie);
router.get('/:id([0-9]{1,})',getById);
router.patch('/:id([0-9]{1,})',updateMovie);
router.del('/:id([0-9]{1,})',deleteMovie);


function getAll (ctx){
    ctx.status = 200;
    ctx.body = movies;
};
function addMovie (ctx){
  let {title,description,release_date,cast} = ctx.request.body;

  let newMovie = {
    title: title,
    description: description,
    release_date: release_date,
    cast:cast
  }
  movies.push(newMovie);
  ctx.status = 200;
};
function getById (){};
function updateMovie (){};
function deleteMovie (){};


module.exports = router;