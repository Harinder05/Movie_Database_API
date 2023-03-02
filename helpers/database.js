const mongoose = require('mongoose');


// Define the schema for the movies collection
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    cast: { type: [String], required: true }
});
  
  // Define the schema for the tvshows collection
const tvshowSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    cast: { type: [String], required: true },
    season: { type: Number, required: true },
    episodes: { type: Number, required: true }
});
  
  
const Movies = mongoose.model('Movies', movieSchema);
const TVShows = mongoose.model('TVShows', tvshowSchema);



exports.run_query = async function run_query(coll,values){
    try{
        const connnection = await mongoose.connect('mongodb://localhost/myapidb',{ useNewParser:true})
        const db = connection.db;
        const data = await db.collection(coll).find({});
        
        return data;
        
    } catch (error) {
        console.log(error)
    }
}

/*

mongoose.connect('mongodb://localhost/myapidb',{ useNewParser:true})
.then(()=> {
    const movies = [
        {
            title:'Inception',
            description:'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
            releaseDate: new Date('2010-07-08'),
            director:'Christopher Nolan',
            cast:['Leonardo DiCaprio',
            'Joseph Gordon-Levitt',
            'Elliot Page',
            'Ken Watanabe',
            'Tom Hardy',
            ]
        },
        {
            title:'The Maze Runner',
            description:'Thomas is deposited in a community of boys after his memory is erased, soon learning they\'re all trapped in a maze that will require him to join forces with fellow "runners" for a shot at escape.',
            releaseDate: new Date('2014-09-11'),
            director:'Wes Ball',
            cast:['Dylan O\'Brien',
            'Kaya Scodelario',
            'Will Poulter',
            'Thomas Brodie-Sangster',
            'Aml Ameen',
            ]
        },
    ];

    const tvshows = [
        {
            title:'Chernobyl',
            description:'In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world\'s worst man-made catastrophes.',
            releaseDate: new Date('2019-05-06'),
            director:'Johan Renck',
            cast:['Jessie Buckley',
            'Jared Harris',
            'Adam Nagaitis',
            'Emily Watson',
            'Paul Ritter',
            ],
            season: 1,
            episodes: 5,
        },
        {
            title:'Band of Brothers',
            description:'The story of Easy Company of the U.S. Army 101st Airborne Division and their mission in World War II Europe, from Operation Overlord to V-J Day.',
            releaseDate: new Date('2001-09-09'),
            director:'David Frankel',
            cast:['Scott Grimes',
            'Damian Lewis',
            'Ron Livingston',
            'Shane Taylor',
            'Donnie Wahlberg',
            ],
            season: 1,
            episodes: 10,
        }
    ]

    Movies.insertMany(movies)
    TVShows.insertMany(tvshows)
    .then(() => console.log('Movies and TVshows added to db'))
    .catch((e) => console.error(e))
})

*/