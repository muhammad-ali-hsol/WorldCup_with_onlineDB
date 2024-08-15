const express=require('express');
const{addCategory,searchTeamCategoryId}=require('../controllers/categoryController')
const { validateAdmin} = require('../middleware/adminAuth');

const categoryRoutes=express.Router();

categoryRoutes.post('/add',validateAdmin,addCategory);
categoryRoutes.get('/getTeamId',searchTeamCategoryId);


module.exports={categoryRoutes};