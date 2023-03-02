const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const prefix = 'api/v1/genres';
const router = Router({prefix:prefix});

router.get('/', getAll);
router.post('/', addGenre);
router.get('/:id([0-9]{1,})',getById);
router.put('/:id([0-9]{1,})',updateGenre);
router.del('/:id([0-9]{1,})',deleteGenre);

function getAll (){
    res.send('HELLO from GENRES')
};
function addGenre (){};
function getById (){};
function updateGenre (){};
function deleteGenre (){};