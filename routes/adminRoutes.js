const express=require('express');
const{createAdmin,commonLogin}=require('../controllers/adminController')

const adminRoutes=express.Router();

adminRoutes.post('/create/:categoryId',createAdmin);
adminRoutes.post('/login',commonLogin);

module.exports={adminRoutes}