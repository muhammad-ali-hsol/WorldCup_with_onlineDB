const express=require('express');
const{generatePlayer,
    // getDetailsOfOnePlayer,
    updatePlayer}=require('../controllers/playerController')
const { validateAdmin} = require('../middleware/adminAuth');

const playerRoutes=express.Router();

playerRoutes.post('/add/:teamId',validateAdmin,generatePlayer);
// playerRoutes.get('/details/:playerId',getDetailsOfOnePlayer);
playerRoutes.put('/update/:playerId',validateAdmin,updatePlayer)

module.exports={playerRoutes};