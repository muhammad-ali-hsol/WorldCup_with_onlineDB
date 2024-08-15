const { Op, and } = require("sequelize");
const { IdentityModel } = require("../models/identity");
const { CategoryModel } = require("../models/category");
const {venueSchema}=require('../middleware/worldcupJoiValidation')


const generateVenue = async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(404).json("Venue details are not given");
    }
    const { error } = venueSchema.validate(data, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message
        }));
        return res.status(403).json(errors);
    }
    try {
        const venueCategoryId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "venue" }
        });
        if (venueCategoryId) {
            const isVenueExist = await IdentityModel.findOne({
                where: {
                    [Op.and]:
                        [{ categoryId: venueCategoryId.id }, { 'meta.code': data.meta.code }]
                }
            }
            );
            if (!isVenueExist) {
                const createVenue = await IdentityModel.create({
                    ...data,
                    categoryId:venueCategoryId.id
                });
                if (createVenue) {
                    return res.status(201).json(`Venue has been created`);
                }
                else {
                    return res.status(400).json(`Error in generating Venue`);
                }
            }
            else {
                return res.status(409).json(`Venue with Code ${data.meta.code} already exist`);
            }
        }
        else {
            return res.status(404).json(`Venue Category Id does not exist`);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }

}

const getDetailsOfAllVenue = async (req, res) => {
    try {
        const venueCategory=await CategoryModel.findOne({
            where:{
                categoryName:"venue"
            }
        });
        if(venueCategory){
            const allVenues = await IdentityModel.findAll({
                attributes: {exclude:
                    ['parentId', 'categoryId']
                },
                where: { categoryId: venueCategory.id }
            });
            if (allVenues.length> 0) {
                return res.status(200).json({venueCategoryId:venueCategory.id, venues:allVenues});
            }
            else{
                return res.status(404).json("No Venue Exist");
            }
        }
        else{
            return res.status(404).json("Venue Category does not exist");
        }
        }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

const getDetailsOfOneVenue = async (req, res) => {
    const { venueId } = req.params;
    if (!venueId) {
        return res.status(404).json("Venue Id is not given");
    }
    try {
        // const venueCategoryId = await CategoryModel.findOne({
        //     attributes: ['id'],
        //     where: { categoryName: "venue" }
        // });
        // if(venueCategoryId){
        //     const venue = await IdentityModel.findOne({
        //         attributes: ['identityName', 'meta'],
        //         where: {
        //             [Op.and]:[
        //                 {  id: venueId },{categoryId:venueCategoryId.id}
        //             ]                
        //         }
        //     });
            const venue = await IdentityModel.findOne({
                attributes: ['identityName', 'meta'],
                where: {
                  id: venueId,
                },
                include: [
                  {
                    model: CategoryModel,
                    attributes: ['id'],
                    where: { categoryName: 'venue' },
                    required: true,
                  },
                ],
              });
            if (venue) {
                return res.status(200).json(venue);
            }
            else{
                return res.status(404).json({status:"Venue with given id does not exist"});
            }
        }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

const updateVenue=async(req,res)=>{
    const {venueId,venueCategoryId} = req.params;
    if (!venueCategoryId || !venueId) {
        return res.status(404).json("Venue ID or Venue Category ID is not given");
    }
    const data = req.body;
    if (!data) {
        return res.status(404).json("Data for Venue Updation is not provided");
    }
    const { error } = venueSchema.validate(data, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message
        }));
        return res.status(403).json(errors);
    }
    try {
        const venueExist = await IdentityModel.findOne({
            where: {
                [Op.and]: [
                    { categoryId: venueCategoryId },
                    { id: venueId }
                ]
            }
        }
        );
        if (venueExist) {
            const updatedVenue = await IdentityModel.update(
                data,{
                where: {
                    [Op.and]: [
                        { categoryId: venueCategoryId },
                        { id: venueId }
                    ]
                }
            }
            );
            if(updatedVenue)
            {
                return res.status(200).json(`Umpire with Id ${venueId} has been updated`);
            }
            else{
                return res.status(400).json(`Issue in Updating Venue`);
            }
        }
        else{
            return res.status(404).json(`Venue with id: ${venueId} does not exist`);
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

const getVenuesByName=async(req,res)=>{
    try{
        const venueCategoryId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "venue" }
        });
        if(venueCategoryId){
            const allVenuesNames = await IdentityModel.findAll({
                attributes: ['id','identityName'],
                where: { categoryId: venueCategoryId.id }
            });
            if(allVenuesNames){
                return res.status(200).json(allVenuesNames);
            }
            else{
                return res.status(404).json("No Venue Exist");
            }
        }
    }
    catch(error){
        return res.status(500).json(error.message);
    }
}

module.exports = { generateVenue, getDetailsOfAllVenue, getDetailsOfOneVenue,updateVenue,getVenuesByName};