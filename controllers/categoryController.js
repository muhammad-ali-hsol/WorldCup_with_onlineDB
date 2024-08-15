const { CategoryModel } = require("../models/category");
const { categorySchema } = require('../middleware/worldcupJoiValidation');

const addCategory = async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(404).jdon("Data is not provided");
    }
    // JOI Validation
    const { error } = categorySchema.validate(data, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message
        }));
        return res.status(400).json(errors);
    }
    try {
        data.categoryName = data.categoryName.toLowerCase();
        const isCategoryExist = await CategoryModel.findOne({
            where:
                { categoryName: data.categoryName }
        });
        if (isCategoryExist) {
            return res.status(409).json(`${data.categoryName} already exists`);
        }
        const createCategory = await CategoryModel.create(data);
        if (createCategory) {
            return res.status(200).json(`${data.categoryName} Category has been Created`);
        }
        else{
            return res.status(400).json("Error in Creating Category");
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }

}

const searchTeamCategoryId = async (req, res) => {
    try {
        const isExist = await CategoryModel.findOne({
            where: { categoryName: "team" }
        });
        if (isExist) {
            return res.status(200).json(isExist.id);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }

}

module.exports = { addCategory, searchTeamCategoryId }