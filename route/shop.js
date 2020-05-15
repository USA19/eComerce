const path = require('path');

const express = require('express');
// const { body } = require('express-validator/check');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
router.get('/',shopController.getShop);
router.get('/contact',shopController.getContact);
router.post('/contact',shopController.postContact);
router.get('/about',shopController.getAbout);
router.get('/shop/:productId',shopController.getProduct);
router.get('/shop',shopController.getProducts);
router.get('/cart',isAuth.customer,shopController.getCart);
router.get('/cart/:productId',isAuth.customer,shopController.postCart);
router.get('/deleteCartItem/:productId',isAuth.customer,shopController.getCartDeleteProduct);
router.get('/clearCart',isAuth.customer,shopController.getClearCart);
router.get('/checkout',isAuth.customer,shopController.getCheckout);
router.post('/checkout',isAuth.customer,shopController.postCheckout);
// router.post('/cart',shopController.postCart);






module.exports = router;