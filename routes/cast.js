const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const prefix = 'api/v1/cast';
const router = Router({prefix:prefix});

router.get('/', getAll);
router.post('/', addCast);
router.get('/:id([0-9]{1,})',getById);
router.put('/:id([0-9]{1,})',updateCast);
router.del('/:id([0-9]{1,})',deleteCast);

function getAll (){
    res.send('HELLO from CAST')
};
function addCast (){};
function getById (){};
function updateCast (){};
function deleteCast (){};