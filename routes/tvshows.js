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

/*
const tvshowSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    cast: { type: [String], required: true },
    season: { type: Number, required: true },
    episodes: { type: Number, required: true }
});
*/