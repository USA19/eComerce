const path = require('path');

const express = require('express');
const authController=require('../controllers/auth');

const router = express.Router();


router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin);
   //login and signup is on the same pageSSSS
 router.post('/signup',authController.postSignup);

 router.get('/reset',authController.getReset);
 router.post('/reset',authController.postReset);

 router.get('/reset/:token',authController.getNewPassword);
 router.post('/newPassword',authController.postNewPassword);

 router.post('/logout',authController.postLogout);



module.exports = router;