const path = require('path');

const express = require('express');
// const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/add-product',isAuth.admin,adminController.getAddProduct);
router.post('/addProduct',isAuth.admin,adminController.postAddProduct);
router.post('/delete/:productId',isAuth.admin,adminController.postDeleteProduct);
router.get('/edit/:productId',isAuth.admin,adminController.getEditProduct);
router.post('/edit',isAuth.admin,adminController.postEditProduct);




module.exports = router;
