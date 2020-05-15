const express = require("express");
const bodyParser = require("body-parser");
const User=require ('../models/user');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');

const crypto=require('crypto');





const transporter = nodemailer.createTransport({
  service:'gmail',
  // service: 'smtp.gmail.com',
  // port: 465,
  // secure: true, // use SSL
  auth: {
      user: 'Yout email here',
      pass: 'Your password here'
  }
});



// mail Options should be like
// Put in email details.

// let mailOptions={
//     from : 'youremail@domain.com',
//     to : 'reciver@domain.com',
//     subject : "This is from Mandrill",
//     html : "Hello,<br>Sending this email using Node and Mandrill"
//  };





exports.getLogin=(req,res,next)=>{
  try{
    let message=req.flash('error');
    let signupMessage=req.flash('err');
    if(signupMessage.length>0){
        signupMessage=signupMessage[0];
        

    }
    else{
        signupMessage=null;
    }
    if(message.length>0){
        message=message[0];
    }
    else{
        message=null;
    }

    res.render('login',{

        title:'SignUp/Login',
        path:'/login',
        signupError:signupMessage,
        errorMessage:message
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


  exports.postLogin= async (req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
 const user=await User.findOne({
        email:email
    })
   
        if(!user){
            req.flash('error',"you have entered wrong email or password.");
            
            return res.redirect('login');//login and signup are on the same single page
    
        }
 const doMatch= bcrypt.compareSync(password, user.password);

            if(doMatch)
            {
              
                req.session.isLoggedIn=true;
                req.session.user=user;
               
                await req.session.save()
                res.redirect('/');
                  
            
               

            }else{
            
            req.flash('error',"you have entered wrong email or password.");
            res.redirect('/login')
          }
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

  exports.postLogout=(req,res,next)=>{
    try{
      req.session.destroy(err=>{
          console.log(err);
          res.redirect('/login');
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

  exports.postSignup=async(req,res,next)=>{
    try{
    
    const email=req.body.email;
    const password=req.body.password;

   const userDocs=await User.findOne({
        email:email
    });
    
        if(userDocs){
            req.flash('err',"This user already exists ");
            return res.redirect('login');//login and signup are on the same single page
        }

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        
        
            const user=new User({
                email:email,
                password:hashedPassword,
                cart:{
                    item:[]
                }
            });
            await user.save();
           res.redirect('/login');
           await transporter.sendMail({
                to:email,
                from:'email here',
                subject:'signup succeeded!',
                html:'<h1>You Successfully SignedUp</h1>'
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



  exports.getReset=(req,res,next)=>{
    try{
    let errorMessage=req.flash('err');
    if(errorMessage.length>0){
        errorMessage=errorMessage[0];
        

    }
    else{
        errorMessage=null;
    }
    res.render('reset',{
        title:'reset',
        path:'/logins',
        errorMessage:errorMessage
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

  exports.postReset = async (req, res, next) => {
    try{
     crypto.randomBytes(32,async (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      const user= await User.findOne({ email: req.body.email });
        
          if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          await user.save();
        
       
          res.redirect('/');
          await transporter.sendMail({
            to: req.body.email,
            from: 'your email here',
            subject: 'Password reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
            `
          });
       
        
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


  exports.getNewPassword = async(req, res, next) => {
    try{
    const token = req.params.token;
    const user=await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
      
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('passwordReset', {
          path: '/login',
          pageTitle: 'New Password',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
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
  
  exports.postNewPassword = async (req, res, next) => {
  try{
    const password = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    const user=User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      
        resetUser = user;
       const hashedPassword= await  bcrypt.hash(newPassword, 12);
    
      
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        await resetUser.save();
     
      
        res.redirect('/login');
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
  
