const express=require('express');
const{generateUmpire,getDetailsOfAllUmpires,
    // getDetailsOfOneUmpire,
     updateUmpire,getUmpiresByNames   }=require('../controllers/umpireController')
const {validateAdmin}=require('../middleware/adminAuth');

const umpireRoutes=express.Router();

umpireRoutes.post('/add',validateAdmin, generateUmpire);
umpireRoutes.get('/showAll',getDetailsOfAllUmpires);
umpireRoutes.put('/update/:umpireId/:umpireCategoryId',validateAdmin,updateUmpire);
// umpireRoutes.get('/details/:umpireId',getDetailsOfOneUmpire);
umpireRoutes.get('/getUmpiresName',getUmpiresByNames);

module.exports={umpireRoutes};