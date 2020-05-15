const express = require("express");
const bodyParser = require("body-parser");


exports.get404=(req,res,next)=>{
  res.render('404',{
    path:"404",
    title:"404",
    subjectMessage:'Not Found' ,
    message:'The page you are looking for is not here.'
  });
}