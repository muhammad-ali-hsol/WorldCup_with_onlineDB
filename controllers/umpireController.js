const { Op, and } = require("sequelize");
const { IdentityModel } = require("../models/identity");
const { CategoryModel } = require("../models/category");



const generateUmpire = async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(404).json("Umpire details are not given");
    }
    if (!data.meta.identityNumber) {
        return res.status(404).json("Identity Number is not given");
    }
    try {
        data.meta.identityNumber = 'um' + data.meta.identityNumber;
        const umpireCategoryId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "umpire" }
        });
        if (umpireCategoryId) {
            const isUmpireExist = await IdentityModel.findOne({
                where: {
                    [Op.and]:
                        [{ categoryId: umpireCategoryId.id }, { 'meta.identityNumber': data.meta.identityNumber }]
                }
            }
            );
            if (!isUmpireExist) {
                const createUmpire = await IdentityModel.create({
                    ...data,
                    categoryId:umpireCategoryId.id
                });
                if (createUmpire) {
                    return res.status(201).json(`Umpire has been created`);
                }
                else {
                    return res.status(400).json(`Error in generating umpire`);
                }
            }
            else {
                return res.status(409).json(`Umpire with Identity Number ${data.meta.identityNumber} already exist`);
            }
        }
        else {
            return res.status(404).json(`Umpire Category Id does not exist`);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }

}

const getDetailsOfAllUmpires = async (req, res) => {
    try {
        const umpireCategory=await CategoryModel.findOne({
            attributes:['id'],
            where:{
                categoryName:"umpire"
            }
        });
        if(umpireCategory){
            const allUmpires = await IdentityModel.findAll({
                attributes: {exclude:
                    ['parentId', 'categoryId']
                },
                where: { categoryId: umpireCategory.id }
            });
            if (allUmpires) {
                return res.status(200).json({umpireCategoryId:umpireCategory.id, umpires:allUmpires});
            }
            else{
                return res.status(400).json("Error in Getting Umpires");
            }
        }
        else{
            return res.status(400).json("Umpire Category does not exist");
        }
        }
    catch (error) {
        return res.status(500).json(error.message);
    }
}
// const getDetailsOfOneUmpire = async (req, res) => {
//     const { umpireId } = req.params;
//     if (!umpireId) {
//         return res.status(404).json("Umpire Id is not given");
//     }
//     try {
//         const umpire = await WorldcupModel.findOne({
//             attributes: ['identityName', 'meta'],
//             where: {
//                 [Op.and]:
//                     [{ id: umpireId }, { role: "umpire" }]
//             }
//         });
//         if (umpire) {
//             return res.status(200).json(umpire);
//         }
//     }
//     catch (error) {
//         return res.status(500).json(error.message);
//     }
// }

const updateUmpire=async(req,res)=>{
    const {umpireId,umpireCategoryId} = req.params;
    if (!umpireCategoryId || !umpireId) {
        return res.status(404).json("Umpire ID or Umpire Category ID is not given");
    }
    const data = req.body;
    if (!data) {
        return res.status(404).json("Data for Umpire updation is not provided");
    }
    try {
        const umpireExist = await IdentityModel.findOne({
            where: {
                [Op.and]: [
                    { categoryId: umpireCategoryId },
                    { id: umpireId }
                ]
            }
        }
        );
        if (umpireExist) {
            const updatedUmpire = await IdentityModel.update(
                data,{
                where: {
                    [Op.and]: [
                        { categoryId: umpireCategoryId },
                        { id: umpireId }
                    ]
                }
            }
            );
            if(updatedUmpire)
            {
                return res.status(200).json(`Umpire with Id ${umpireId} has been updated`);
            }
            else{
                return res.status(400).json(`Issue in Updating Player`);
            }
        }
        else{
            return res.status(400).json(`Umpire with id: ${umpireExist} does not exist`);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

const getUmpiresByNames=async(req,res)=>{
    try{
        const umpireCategoryId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "umpire" }
        });
        if(umpireCategoryId){
            const allUmpiresNames = await IdentityModel.findAll({
                attributes: ['id','identityName'],
                where: { categoryId: umpireCategoryId.id }
            });
            if(allUmpiresNames){
                return res.status(200).json(allUmpiresNames);
            }
            else{
                return res.status(404).json("No Umpire Exist");
            }
        }
    }
    catch(error){
        return res.status(500).json(error.message);
    }
}


module.exports = { generateUmpire, getDetailsOfAllUmpires, 
    // getDetailsOfOneUmpire,
    updateUmpire, getUmpiresByNames };