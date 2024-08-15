const Joi = require('joi');

const productSchema = Joi.object({
    productName: Joi.string().required().messages({
        'string.base': 'Product Name must be a string',
        'string.empty': 'Product Name cannot be empty',
        'any.required': 'Product Name is required'
    }),
    productDescription: Joi.string().messages({
        'string.base': 'Product Name must be a string',
        'string.empty': 'Product Name cannot be empty',
        'any.required': 'Product Name is required'
    }),
    productPrice: Joi.number().positive().required().messages({
        'number.base': 'ID should be a number and must be positive',
        'any.required': 'ID is required'
    }),
    // createdBy: Joi.string().email().required().messages({
    //     'string.email': 'Creator email must be a valid email address',
    //     'string.empty': 'Creator email cannot be empty',
    //     'any.required': 'Creator email is required'
    // }),
    imageURL: Joi.string().required().messages({
        'string.empty': 'Image URL cannot be empty',
        'any.required': 'Image URL is required'
    }),
});

const orderSchema = Joi.object({
    orderDescription: Joi.string().messages({
        'string.base': 'Order Description must be a string',
        'string.empty': 'Order Description cannot be empty',
    }),
    // orderStatus: Joi.string().valid('active', 'inactive').messages({
    //     'any.only': 'Order Status must be either active or inactive',
    //     'string.base': 'Order Status must be a string',
    //     'string.empty': 'Order Status cannot be empty',
    //     'any.required': 'Order Status is required'
    // }),
    address: Joi.string().required().messages({
        'string.empty': 'Address cannot be empty',
        'any.required': 'Address is required'
    }),
});



module.exports={productSchema,orderSchema}