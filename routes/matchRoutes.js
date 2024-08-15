const express = require('express');
const { createMatch, searchMatchByMatchId, searchMatchByTeamId, getAllMatches, updateMatch, updateWonStatus } = require('../controllers/matchController')
const { validateAdmin } = require('../middleware/adminAuth');

const matchRoutes = express.Router();

matchRoutes.post('/create', validateAdmin, createMatch);
matchRoutes.get('/showAll', getAllMatches);
matchRoutes.get('/show/:matchId', searchMatchByMatchId);
matchRoutes.get('/showMatches/:teamId', searchMatchByTeamId);
matchRoutes.put('/update/:matchId', validateAdmin, updateMatch);
matchRoutes.patch('/updateStatus/:matchId', validateAdmin, updateWonStatus);

module.exports = { matchRoutes };










