const { Op, and } = require("sequelize");
const { IdentityModel } = require("../models/identity");
const { CategoryModel } = require("../models/category");
const {playerSchema}=require('../middleware/worldcupJoiValidation')



const generatePlayer = async (req, res) => {
    const { teamId } = req.params;
    if (!teamId) {
        return res.status(404).json("Team ID is not given");
    }
    const data = req.body;
    if (!data) {
        return res.status(404).json("Player details are not given");
    }
    if (!data.meta.identityNumber) {
        return res.status(404).json("Identity Number of Player is not given");
    }
    try {
        data.meta.identityNumber = 'pl' + data.meta.identityNumber;
        const isTeamExist = await IdentityModel.findOne({
            where: {
                id: teamId
            }
        });
        if (isTeamExist) {
            const categoryPlayer = await CategoryModel.findOne({
                attributes: ['id'],
                where: { categoryName: "player" }
            });
            if (categoryPlayer) {
                const isPlayerExist = await IdentityModel.findOne({
                    where: {
                        [Op.and]:
                            [{ categoryId: categoryPlayer.id }, { 'meta.identityNumber': data.meta.identityNumber }]
                    }
                }
                );
                if (!isPlayerExist) {
                    // data.parentId=isTeamExist.id;
                    // data.categoryId=categoryPlayer.id;
                    const createPlayer = await IdentityModel.create({
                        ...data,
                        parentId: isTeamExist.id,
                        categoryId: categoryPlayer.id
                    }
                    );
                    if (createPlayer) {
                        return res.status(201).json(`Player has been created`);
                    }
                    else {
                        return res.status(400).json(`Issue in generating player`);
                    }
                }
                else {
                    return res.status(409).json(`Player with Identity Number ${data.meta.identityNumber} already exist`);
                }

            }
            else {
                return res.status(404).json(`Category Of Player does not exist`);
            }
        }
        else {
            return res.status(404).json("Team with given ID does not exist");
        }

    }
    catch (error) {
        return res.status(500).json(error.message);
    }

}

// Not using It

// const getDetailsOfOnePlayer = async (req, res) => {
//     const { playerId } = req.params;
//     if (!playerId) {
//         return res.status(404).json("Player Identity number is not given");
//     }
//     try {
//         const detailsOfPlayer = await WorldcupModel.findOne({
//             attributes: ['identityName', 'meta'],
//             where: { id: playerId }
//         });

//         if (detailsOfPlayer) {
//             return res.status(200).json(detailsOfPlayer);
//         }
//         else {
//             return res.status(404).json(`No user with ${id} exists`);
//         }
//     }
//     catch (error) {
//         return res.status(500).json(error.message);
//     }

// }

const updatePlayer = async (req, res) => {
    const { playerId } = req.params;
    if (!playerId) {
        return res.status(404).json("Player ID  is not given");
    }
    const data = req.body;
    if (!data) {
        return res.status(404).json("Data for Player updation is not provided");
    }
    const { error } = playerSchema.validate(data, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message
        }));
        return res.status(403).json(errors);
    }
    try {
        const playerCategoryId = await CategoryModel.findOne({
            attributes:['id'],
            where: {
                     categoryName: "player" 
            }
        });
        if(playerCategoryId){
            const playerExist = await IdentityModel.findOne({
                where: {
                    [Op.and]: [
                        { categoryId: playerCategoryId.id },
                        { id: playerId }
                    ]
                }
            }
            );
            if (playerExist) {
                const updatedPlayer = await IdentityModel.update(
                    data,{
                    where: {
                        [Op.and]: [
                            { categoryId: playerCategoryId.id },
                            { id: playerId }
                        ]
                    }
                }
                );
                if(updatedPlayer)
                {
                    // return res.status(200).json(`Player with Identity Number ${data.meta.identityNumber} has been updated`);
                    return res.status(200).json(`Player has been updated`);
                }
                else{
                    return res.status(400).json(`Issue in Updating Player`);
                }
            }
            else{
                return res.status(404).json(`Player with id: ${playerId} does not exist`);
            }
        }
       
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}


module.exports = { generatePlayer, 
    // getDetailsOfOnePlayer ,
    updatePlayer}