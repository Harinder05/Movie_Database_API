const Movies = require("../schemas/movies");
const info = require("../config");
const axios = require("axios");
const NodeCache = require("node-cache")
const cache = new NodeCache ({stdTTL: 5*60})


const apikey = info.config.apikey;


exports.searchMovie = async function searchMovie(ctx,title) {
    try{
        // Search local database first
        const localresult = await Movies.find({title: new RegExp(title,'i')}).select('-__v')
        console.log(localresult)
        if (localresult.length > 0) {
            
            let formattedResult = "THESE RESULTS ARE FROM LOCAL DATABASE\n\n";
            localresult.forEach((movie) => {
                
                formattedResult += `Movie ID: ${movie.id}\n`;
                formattedResult += `Title: ${movie.title}\n`;
                formattedResult += `Description: ${movie.description}\n`;
                formattedResult += `Release Date: ${new Date(movie.releaseDate).toLocaleDateString()}\n`;
                formattedResult += `Director: ${movie.director}\n`;
                formattedResult += `Cast: ${movie.cast}\n`;
                formattedResult += "\n"
                });
            return formattedResult;
        }else{
            // Mmake request to third party api
            const requestUrl = `https://imdb-api.com/en/API/SearchMovie/${apikey}/${title}`
            const apiresponse = await axios.get(requestUrl);
            
            if (apiresponse.status !== 200) {
                throw new Error("Failed to get data from IMDb Api")
            }
    
            const result = apiresponse.data.results

            const pagenumber = ctx.query.page || 1;
            const itemsonpage = ctx.query.limit || 5;

            const paginatedresults = paginate(result,pagenumber,itemsonpage)


            let formattedResult = "THESE RESULTS ARE FROM THE IMDB API\n\n";
            paginatedresults.forEach((movie) => {
                
                formattedResult += `Imdb ID: ${movie.id}\n`;
                formattedResult += `Title: ${movie.title}\n`;
                formattedResult += `Description: ${movie.description}\n`;
                formattedResult += `Poster Image: ${movie.image}\n`;
                formattedResult += "\n"
                });

            return formattedResult;
        }
        
    } catch (err){
        console.error(err.message)
    }    
}



function paginate(results,pagenumber,itemsonpage) {
    const start = (pagenumber-1) * itemsonpage;
    
    const end = start + parseInt(itemsonpage);
    
    return results.slice(start,end);
}