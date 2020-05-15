//jshint es-version:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _=require('lodash');//lodash kehtay he hai "_"
// const cookieParser = require('cookie-parser');
const User = require('./models/user');
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
// const csrfProtection=csrf();
const flash = require('connect-flash');

const multer=require('multer');
const mongoose=require('mongoose');
const path=require('path');
const app=express();
const shopRoute=require('./route/shop');
const adminRoute=require('./route/admin');
const authRoute=require('./route/auth');
const errorController=require('./controllers/error');

mongoose.connect('mongodb://localhost:27017/shop', {useNewUrlParser: true,useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/shop",
  collection: 'sessions'
});



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  // app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(express.static(path.join(__dirname,"public")));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);



// app.use(csrfProtection);
app.use(flash());


// USed to include token and isLoggedIn information to render in every page
app.use((req, res, next) => {
  // res.locals.csrfToken = req.csrfToken();
  res.locals.isLoggedIn = req.session.isLoggedIn;
  
  res.locals.user= req.session.user;
  // if (!req.session.user) {
  //   res.locals.cartItems= '';
  //   return next();
  // } 
  

 
  next();
});

app.use(async(req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    res.locals.cartItems= '';
    
 return next();
  }
  if(req.session.user.cart.items.isEmpty){
    res.locals.cartItems= '';
    return  next();
  }
 const user=await User.findById(req.session.user._id)
    
      if (!user) {
        return next();
      }
      req.user = user;
      const userProducts=await req.user.populate('cart.items.productId').execPopulate();
    
      const products = userProducts.cart.items;
           
           let total = 0;
          products.forEach(p => {
            total += p.quantity * p.productId.price;
          });
          // console.log(products);
          res.locals.cartItems= products;
          res.locals.total= total;
          
      
      next();
    
    
});



app.use(multer({ storage: fileStorage,fileFilter:fileFilter }).single('image'));
app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(authRoute);

app.use(errorController.get404);


app.listen(3000);