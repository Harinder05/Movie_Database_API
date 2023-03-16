const errorHandler = (err,ctx,next)=>{
    console.log(err.stack)
    ctx.status=1000;
    ctx.body = {message: err.message}
}

module.exports = errorHandler;