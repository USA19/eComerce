const express = require("express");
const bodyParser = require("body-parser");
const Product=require ('../models/addProduct');
const Order=require ('../models/order');
const nodemailer=require('nodemailer');


const transporter = nodemailer.createTransport({
  service:'gmail',
  // service: 'smtp.gmail.com',
  // port: 465,
  // secure: true, // use SSL
  auth: {
      user: 'muhamedusama648@gmail.com',
      pass: 'aliheider5689@'
  }
});

exports.getShop=(req,res,next)=>{
  
     
        res.render('home',{
          path:'/',
         
          title:"Home"
        });
      }
   
 


exports.getProducts=async (req,res,next)=>{
  try{
  const products =await Product.find();
  res.render('shop',{
    title:'Shop',
    path:'/shop',
    products:products
  
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

};

exports.getProduct=async(req,res,next)=>{
try{
const prodId=req.params.productId;
const product= await Product.findById({_id:prodId});

  if(!product){
    return next(err);
  }
  res.render('product-details',{
    path:'/shop',
    title:'Shop',
    product:product
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
};
exports.getContact=(req,res,next)=>{
  try{
  res.render('contact-us',{
    path:'/contact',
    title:"Contact Us"
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


exports.postContact=async(req,res,next)=>{
  try{
const email=req.body.email;
const problem=req.body.problem; 

await transporter.sendMail({
  to:email,
  from:'muhamedusama648@gmail.com',
  subject:'signup succeeded!',
  html:`<h1>Thankyou for letting us know your problem!</h1>
  <p>You will notify on your query soon </p>`
});
//sending mail to admin
await transporter.sendMail({
to:'muhamedusama468@gmail.com',
from:'muhamedusama648@gmail.com',
subject:'Problem',
html:`<h1>The Person with email ${email}just submitted a Problem </h1>
<p>problem</p>`
});

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

exports.getAbout=(req,res,next)=>{
  try{
  res.render('about-us',{
    
    title:"About Us",
    path:'/about'
    
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


exports.getCart = async (req, res, next) => {
  try{
  const user=await req.user.populate('cart.items.productId').execPopulate()
    
  const products = user.cart.items;
       
       let total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
      
      res.render('cart', {
        path: '/cart',
        title: 'Your Cart',
        products: products,
        total:total
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
  
};



exports.postCart = async (req, res, next) => {
 
   try{
   const prodId = req.params.productId;
   
    const product=await Product.findById(prodId);
   
    const result= await req.user.addToCart(product);
    
    
      
      res.redirect('/cart');
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

exports.getCartDeleteProduct = async(req, res, next) => {
 try{ 
  const prodId = req.params.productId;
 
   const result =await  req.user.removeFromCart(prodId);
  
  
   
      res.redirect('/cart');
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


exports.getClearCart = async(req, res, next) => {
  try{
  const result =await  req.user.clearCart();
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
exports.getCheckout = (req, res, next) => {
  try{
  let message=req.flash('error');
  
  if(message.length>0){
      message=message[0];
      }else{
        message=null;
      }
      res.render('checkout', {
        path: '/checkout',
        title: 'Checkout',
        message:message
       
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
   
};

exports.postCheckout = async(req, res, next) => {
  try{
  
  
  const currentAddress=req.body.cAddress;
  const shippingAddress=req.body.pAddress;
  
 
  if(currentAddress===""||shippingAddress===""){
    req.flash('error','You Must Fill Both The Fields');

    
     return res.redirect('/checkout');
  }
    let total = 0;
    const user= await req.user.populate('cart.items.productId').execPopulate();
  
      
     
     
     const products= user.cart.items;
     
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      await  order.save();
     
    
     await req.user.clearCart();

     await  transporter.sendMail({
      to:req.user.email,
      from:'muhamedusama648@gmail.com',
      subject:'signup succeeded!',
      html:`<h1>Thankyou for you order!</h1>
      <p>Your total bill is ${total}</p>`
  });
  //sending mail to admin
  await  transporter.sendMail({
    to:'muhamedusama468@gmail.com',
    from:'muhamedusama648@gmail.com',
    subject:'signup succeeded!',
    html:`<h1>Order Details</h1><p>${products}</p>
    <p>The total bill is ${total}</p>`
});
   
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




