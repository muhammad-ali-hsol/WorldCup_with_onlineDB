const express=require('express');
const{addProduct,getAllProducts}=require('../controllers/productController')

const productRoutes=express.Router();

productRoutes.post('/add',addProduct);
productRoutes.get('/getAll',getAllProducts);

module.exports={productRoutes}