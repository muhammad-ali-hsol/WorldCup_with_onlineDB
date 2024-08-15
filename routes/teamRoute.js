const express=require('express');
const{generateTeam,showDetailsOfAllTeams,showDetailsOfSixTeams,
    // showDetailsOfOneTeam,
    detailsOfPlayersOfSpecificTeam,updateTeam,getTeamsByNames}=require('../controllers/teamController')
const { validateAdmin} = require('../middleware/adminAuth');

const teamRoutes=express.Router();

teamRoutes.post('/add',validateAdmin,generateTeam);
teamRoutes.get('/showSix',showDetailsOfSixTeams);
teamRoutes.get('/showAll',showDetailsOfAllTeams);
teamRoutes.put('/update/:teamId/:teamCategoryId',validateAdmin,updateTeam);
// teamRoutes.get('/show/:teamId/:categoryTeamId',showDetailsOfOneTeam);
teamRoutes.get('/players/:teamId',detailsOfPlayersOfSpecificTeam);
teamRoutes.get('/getTeamsName',getTeamsByNames);

module.exports={teamRoutes};