// This is default error handler function which is override the express error handle fucntion
const errorHandler =(err,req,res ,next)=>{
    // 500 is a server error code
    const statusCode =  res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV === 'production' ?null:err.stack,
    })
}

module.exports = {
    errorHandler,
}