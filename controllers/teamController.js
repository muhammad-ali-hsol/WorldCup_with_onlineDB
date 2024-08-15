const { Op, and } = require("sequelize");
const { CategoryModel } = require("../models/category");
const { IdentityModel } = require("../models/identity");
const { teamSchema} = require('../middleware/worldcupJoiValidation');
const { sequelize } = require("../config/dbConnect");


const generateTeam = async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(404).json("Team details are not given");
    }
    const {error}= teamSchema.validate(data);
    if(error){
        return res.status(403).json("Data Validation Failed");
    }
    try {
        const teamId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "team" }
        });
        if (teamId) {
            data.identityName = data.identityName.toLowerCase();
            const isTeamExist = await IdentityModel.findOne({
                where: {
                    [Op.and]:
                        [{ identityName: data.identityName }, { categoryId: teamId.id }]
                },
            }
            );
            if (isTeamExist) {
                return res.status(409).json("Team with this name already exists");
            }
            const createTeam = await IdentityModel.create({...data,categoryId:teamId.id});
            if (createTeam) {
                return res.status(201).json(`Team has been created`);
            }
        }
        else {
            return res.status(404).json("This Category does not exist");
        }
            
        }
    catch (error) {
        return res.status(500).json(error.message);
    }

}

const showDetailsOfAllTeams = async (req, res) => {
    try {
        const teamId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "team" }
        });
        if (teamId) {
            const allTeams = await IdentityModel.findAll({
                attributes: {
                    exclude: ['parentId','categoryId']
                },
                where: {
                    categoryId: teamId.id
                }
            });
            if (allTeams) {
                for (let teamData of allTeams) {
                    teamData.identityName = firstAlphabetCapital(teamData.identityName);
                }
                return res.status(200).json({teamCategoryId:teamId.id, teamsData:allTeams});
            }
            else{
                return res.status(404).json("No Team Exist");
            }
        }
        else {
            return res.status(404).json("This Category does not exist");
        }
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

const showDetailsOfSixTeams = async (req, res) => {
    try {
        const teamId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "team" }
        });
        if(teamId){
            const allTeams = await IdentityModel.findAll({
                attributes: {
                    exclude: ['parentId','categoryId']
                },
                where: {
                    categoryId: teamId.id
                },
                limit:6
            });
            if (allTeams) {
                for (let teamData of allTeams) {
                    teamData.identityName = firstAlphabetCapital(teamData.identityName);
                }
                return res.status(200).json(allTeams);
            }
        }
        else {
            return res.status(404).json("This Category does not exist");
        }
           
     
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}

// Not using it 15 August

// const showDetailsOfOneTeam = async (req, res) => {
//     const { teamId } = req.params;
//     if (teamId) {
//         return res.status(404).json("Team ID has not given");
//     }
//     try {
//         const teamId = await CategoryModel.findOne({
//             attributes: ['id'],
//             where: { categoryName: "team" }
//         });
//         if (teamId) {
//             const team = await IdentityModel.findOne({
//                 attributes: {
//                     exclude: ['parentId']
//                 },
//                 where: {
//                     [Op.and]:
//                         [{ categoryId: teamId.id }, { id: teamId }]
//                 }
//             });
//             if (team) {
//                 team.identityName = firstAlphabetCapital(team.identityName);
//                 return res.status(200).json(team);
//             }
//             else {
//                 return res.status(404).json("No Team Found with this id");
//             }
//         }
//     }
//     catch (error) {
//         return res.status(500).json(error.message);
//     }
// }

const detailsOfPlayersOfSpecificTeam=async(req,res)=>{
    const {teamId}=req.params;
    if(!teamId){
        return res.status(404).json("Team ID is not given");
    }
    try{
        const teamPlayerCategory = await CategoryModel.findAll({
            attributes: ['id','categoryName'],
            where:{
                [Op.or]:[
                 {categoryName: "team"},
                 {categoryName:"player"}
                ]    
            } 
        });
        if( teamPlayerCategory )
        {
            let playerCategoryId;
            let teamCategoryId;
            for(team of  teamPlayerCategory )
            {
                if(team.categoryName==="player")
                {
                    playerCategoryId=team.id
                }
                else{
                    teamCategoryId=team.id
                }
            }
            const teamExist=await IdentityModel.findOne({
                attributes:['id','meta','identityName','imageURL'],
                where:{id:teamId}
            });
            if(teamExist){
                teamExist.identityName=firstAlphabetCapital(teamExist.identityName);
                const playersOfTeam=await IdentityModel.findAll({
                    attributes:['id','identityName','meta','imageURL'],
                    // attributes:['id','identityName',[sequelize.json('meta.age'),'age'],'imageURL'],
                    where:{
                        [Op.and]:
                        [{categoryId:playerCategoryId},{parentId:teamExist.id}]
                    }
                });
                if(playersOfTeam){
                    return res.status(200).json({
                        // playerCategoryId:playerCategoryId,
                        team:teamExist,
                        players:playersOfTeam
                    });
                }
            }

            else{
                return res.status(404).json(`Team with ID: ${id} not given`);
            }   
        }
    }
    catch(error){
        return res.status(500).json(error.message);
    }
}

const updateTeam=async(req,res)=>{
    const{teamId,teamCategoryId}=req.params;
    if(!teamId || !teamCategoryId)
    {
        return res.status(404).json("Team ID or Category ID is not given");
    }
    const data=req.body;
    if(!data)
    {
        return res.status(404).json("Data for updation is not provided");
    }
    try{
        const teamExist=await IdentityModel.findOne({
            // where:{
            //     categoryId:teamCategoryId,   
            //     id:teamId
            // }
            where: {
                [Op.and]:
                [
                    {categoryId: teamCategoryId},
                    {id: teamId}
                ]
              }
        });
        if(teamExist)
        {
            data.identityName=data.identityName.toLowerCase();
            const updateTeam = await IdentityModel.update(
                data, 
                {
                  where: {
                    [Op.and]:
                    [
                        {categoryId: teamCategoryId},
                        {id: teamId}
                    ]
                  }
                }
              );
              
            
            if(updateTeam){
                return res.status(201).json("Team has been Updated");
            }
        }
    }
    catch(error){
        return res.status(500).json(error.message);
    }
}

const getTeamsByNames=async(req,res)=>{
    try{
        const teamCategoryId = await CategoryModel.findOne({
            attributes: ['id'],
            where: { categoryName: "team" }
        });
        if(teamCategoryId){
            const allTeamsNames = await IdentityModel.findAll({
                attributes: ['id','identityName'],
                where: { categoryId: teamCategoryId.id }
            });
            if(allTeamsNames){
                for (let teamData of allTeamsNames) {
                    teamData.identityName = firstAlphabetCapital(teamData.identityName);
                }
                return res.status(200).json(allTeamsNames);
            }
            else{
                return res.status(404).json("No team Exist");
            }
        }
    }
    catch(error){
        return res.status(500).json(error.message);
    }
}

const firstAlphabetCapital = (team) => {
    let splitName = team.split(' ');
    let correctName = '';
    for(let name of splitName)
    {
        correctName+=name[0].toUpperCase()+name.slice(1)+" ";
    }
    return correctName.trim();
}



module.exports = { generateTeam,   showDetailsOfAllTeams,
     showDetailsOfSixTeams, 
    //   showDetailsOfOneTeam, 
     detailsOfPlayersOfSpecificTeam ,updateTeam, getTeamsByNames
}