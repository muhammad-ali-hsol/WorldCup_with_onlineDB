const { ComplianceModel } = require('../models/compliance');
const { CategoryModel } = require('../models/category');
const { adminSchema, complianceLoginValidate,helpingFunctionToCheckIdIsNumberandPositive} = require('../middleware/worldcupJoiValidation');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const createAdmin = async (req, res) => {
  const { categoryId } = req.params;
  // Joi Validation
  const categoryIdValidationFailed=helpingFunctionToCheckIdIsNumberandPositive("Category",categoryId);
  if(categoryIdValidationFailed){
    return res.status(400).send(categoryIdValidationFailed);
  }
 
  const data = req.body;
  if (!data) {
    return res.status(404).send("Data is not provided");
  }

  //Joi Validation
  const { error } = adminSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map(detail => ({
      message: detail.message
    }));
    return res.status(403).send(errors);
  }

  try {
    const isExist = await ComplianceModel.findOne({
      where:
        { email: data.email }
    });
    if (isExist) {
      return res.status(409).json("Email or phone already exists");
    }
    const { password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    data.password = hashPassword;

    const newCompliance = await ComplianceModel.create({
      ...data,
      categoryId: categoryId,
      createdBy: process.env.ADMIN_CREATED_BY
    });
    if(newCompliance){
      return res.status(201).json("Compliance Role has been created");
    }
    else{
      return res.status(400).json("Error in generating compliance");
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const commonLogin = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(404).send("Error in getting Data");
  }
  const { error } = complianceLoginValidate.validate(data);
  if (error) {
    return res.status(400).json('Joi Validation Error');
  }
  try {
    const loginValid = await ComplianceModel.findOne(
      {
        where:
          { email: data.email },
        include: [{
          model: CategoryModel,
          required: true
        }]
      });
    if (loginValid) {
      const passwordMatch = await bcrypt.compare(data.password, loginValid.password);
      if (!passwordMatch) {
        return res.status(404).json("Password mismatch");
      }
      const payload = {
        id: loginValid.id,
        email: loginValid.email,
        name: loginValid.complianceName,
        role: loginValid.category.categoryName
      }
      const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: '3d' });
      res.set('token', token);
      return res.status(200).json({ status: "Successful Login", token });
    }
    else {
      return res.status(404).json("Invalid Email");
    }

  }
  catch (err) {
    return res.status(500).json(err.message);
  }
}

module.exports = { createAdmin, commonLogin }