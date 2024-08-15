const {ProductModel}=require('../models/product');
const {productSchema}=require('../middleware/ecommerceJoiValidation');


const addProduct=async(req,res)=>{
    const data=req.body;
    const { error } = productSchema.validate(data, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message
        }));
        return res.status(400).json(errors);
    }
    data.createdBy=process.env.PRODUCT_CREATOR;
    try{
        const createProduct=await ProductModel.create(data);
        if(createProduct){
            return res.status(200).json("Product has been added");
        }
        else{
            return res.status(400).json("Error in Generating Product");
        }
    }
    catch(error){
        return res.status(500).json(error.message);
    }
};

const getAllProducts=async(req,res)=>{
    try{
        const allProducts=await ProductModel.findAll();
        if(allProducts){
            return res.status(200).json(allProducts);
        }
        else{
            return res.status(400).json("No Product Exist");
        }
    }
    catch(error){
        return res.status(500).json(error.message);
    }
};



module.exports={addProduct,getAllProducts}