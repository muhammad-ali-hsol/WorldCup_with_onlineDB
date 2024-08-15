const Joi = require('joi');


const categorySchema = Joi.object({
    categoryName: Joi.string().required().messages({
            'string.base': 'Category name must be a string',
            'string.empty': 'Category name cannot be empty',
            'any.required': 'Category name is required'
        }),
    createdBy: Joi.string().email().required().messages({
            'string.email': 'Creator email must be a valid email address',
            'string.empty': 'Creator email cannot be empty',
            'any.required': 'Creator email is required'
        })
});
const adminSchema = Joi.object({
    complianceName:Joi.string().required().messages({
        'string.base': 'Compliance name must be a string',
        'string.empty': 'Compliance name cannot be empty',
        'any.required': 'Compliance name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Creator email must be a valid email address',
        'string.empty': 'Creator email cannot be empty',
        'any.required': 'Creator email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min':'Password must be greater than six characters'
    })
});
const teamSchema = Joi.object({
    identityName:Joi.string().required(),
    imageURL: Joi.string().required(),
    meta:Joi.object({
        description:Joi.string().required(),
    })
});
const matchSchema = Joi.object({
    matchName: Joi.string().required().messages({
        'any.required': 'Match name is required'
    }),
    date: Joi.date().greater('now').required().messages({
        'date.greater': 'Date should be greater than the current date',
        'any.required': 'Date is required'
    }),
    time: Joi.string().required().messages({
        'any.required': 'Time is required'
    }),
    team1: Joi.number().positive().required().messages({
        'number.base': 'Team 1 should be a number and must be positive',
        'any.required': 'Team 1 is required'
    }),
    team2: Joi.number().positive().required().messages({
        'number.base': 'Team 2 should be a number and must be positive',
        'any.required': 'Team 2 is required'
    }),
    umpire1: Joi.number().positive().required().messages({
        'number.base': 'Umpire 1 should be a number and must be positive',
        'any.required': 'Umpire 1 is required'
    }),
    umpire2: Joi.number().positive().required().messages({
        'number.base': 'Umpire 2 should be a number and must be positive',
        'any.required': 'Umpire 2 is required'
    }),
    venue: Joi.number().positive().required().messages({
        'number.base': 'Venue should be a number and must be positive',
        'any.required': 'Venue is required'
    })
});
const idNumberAndPositiveCheck= Joi.number().positive().required().messages({
    'number.base': 'ID should be a number and must be positive',
    'any.required': 'ID is required'
})
const complianceLoginValidate= Joi.object({
    email:Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})
const playerSchema=Joi.object({
    id:Joi.number().min(0).required(),
    identityName:Joi.string().required(),
    imageURL:Joi.string().required(),
    meta:Joi.object({
        identityNumber:Joi.string().required(),
        role:Joi.string().required(),
        age:Joi.number().min(0).required(),
        height:Joi.string().required(),
        weight:Joi.string().required(),
        totalMatchesPlayed:Joi.number().min(0).required(),
    })
})
const venueSchema=Joi.object({
    id:Joi.number().min(0).required(),
    identityName:Joi.string().required(),
    imageURL:Joi.string().required(),
    meta:Joi.object({
        location:Joi.string().required(),
        code:Joi.number().min(0).required(),
        capacity:Joi.number().min(0).required(),
    })
})
const helpingFunctionToCheckIdIsNumberandPositive=(idName,data)=>{
    const {error}=idNumberAndPositiveCheck.validate(data);
    if(error)
    {
        let errorMessage=idName+" "+ error.message;
        return errorMessage;
    }
    else{
        return null;
    }
}

module.exports={matchSchema,categorySchema,adminSchema,complianceLoginValidate,teamSchema, 
     helpingFunctionToCheckIdIsNumberandPositive,playerSchema ,venueSchema}