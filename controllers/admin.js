const express = require("express");
const bodyParser = require("body-parser");
const Product=require ('../models/addProduct');
const fileHelper=require('../util/file');//function for deleteing the product locally

exports.getAddProduct=(req,res,next)=>{
  try{
     res.render('add-product',{
       title:"Add Product",
       product:"",
       path:'/admin/addProduct'
     });
    }
    catch{
      res.render('404',{
        path:"500",
        title:"500",
        subjectMessage:'Sorry' ,
        message:'Something Went Wrong We Are Working On It.'
      });
    } 
 
}


exports.postAddProduct= async (req,res,next)=>{
  try{
        const title=req.body.title;
        const price=req.body.price;
        const imageUrl=req.file.path;
        const description=req.body.description;
    const product=new Product({
      title:title,
      price:price,
      imageUrl:imageUrl,
      description:description


    });
    const  result=await product.save();
  
     
    res.redirect('/shop');
  }
  catch{
    res.render('404',{
      path:"500",
      title:"500",
      subjectMessage:'Sorry' ,
      message:'Something Went Wrong We Are Working On It.'
    });
  }

}

exports.postDeleteProduct = async (req, res, next) => {
  try{
  const prodId = req.params.productId;
 const product=await Product.findById(prodId)
    
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      await Product.deleteOne({ _id: prodId });
    
   
      
      res.redirect('/shop');
    }
    catch{
      res.render('404',{
        path:"500",
        title:"500",
        subjectMessage:'Sorry' ,
        message:'Something Went Wrong We Are Working On It.'
      });
    }
    
};




exports.getEditProduct= async (req,res,next)=>{
  try{
  const prodId=req.params.productId;
 const product=await Product.findById({_id:prodId})
  
    
    if(!product){
      return next(new Error('Product not found.'));
    }
    res.render('add-product',{
      product:product,
      title:"Edit Product",
      path:'/admin/edit'
    });
  }
  catch{
    res.render('404',{
      path:"500",
      title:"500",
      subjectMessage:'Sorry' ,
      message:'Something Went Wrong We Are Working On It.'
    });
  }

}



exports.postEditProduct=async (req,res,next)=>{
  try{
    const _id=req.body.productId;
        const title=req.body.title;
        const price=req.body.price;
        const imageUrl=req.file.path;
        const description=req.body.description;
       const product =await Product.findById({
          _id:_id
        })
       
          if(!product){
            return  next(new Error('Product not found.'));
          }
          product.title=title;
          product.description=description;
          product.price=price;
          if(product.imageUrl!==imageUrl){
            fileHelper.deleteFile(product.imageUrl);
            
            
          }
          product.imageUrl=imageUrl;


         await  product.save();
    
            res.redirect('/shop');
         
        }
        catch{
          res.render('404',{
            path:"500",
            title:"500",
            subjectMessage:'Sorry' ,
            message:'Something Went Wrong We Are Working On It.'
          });
        }
    

  
}