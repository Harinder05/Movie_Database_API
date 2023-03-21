exports.isAdmin = async (ctx,next) =>{
    try {
        if (ctx.state.user.role !== 'admin'){
            ctx.throw(403,"Access Denied. Only Admins can access")
        }
        await next()
    } catch (err){
        ctx.status = err.status;
        ctx.body = {message: err.message};
    }
    
};