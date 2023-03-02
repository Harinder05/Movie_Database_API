const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const prefix = 'api/v1/tvshows';
const router = Router({prefix:prefix});

router.get('/', getAll);
router.post('/', addTvshow);
router.get('/:id([0-9]{1,})',getById);
router.put('/:id([0-9]{1,})',updateTvshow);
router.del('/:id([0-9]{1,})',deleteTvshow);

function getAll (){
    res.send('HELLO from TVSHOWS')
};
function addTvshow (){};
function getById (){};
function updateTvshow (){};
function deleteTvshow (){};