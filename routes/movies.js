const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const prefix = 'api/v1/movies';
const router = Router({prefix:prefix});

router.get('/', getAll);
router.post('/', addMovie);
router.get('/:id([0-9]{1,})',getById);
router.put('/:id([0-9]{1,})',updateMovie);
router.del('/:id([0-9]{1,})',deleteMovie);
