const express = require('express');
const app = express();

// Route configuration
const blogRouter = require("./Routes/BlogRouter");
app.use(blogRouter);


// middleware function
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//client-error handling
app.use((req, res,next)=>{
    next(createError(404, "route not found"))
})


//server-error handling==all errors
app.use((err,req, res,next)=>{
    return res.status(err.status || 500).json
    ({success:false, 
      message:err.message})
})


module.exports=app;
  