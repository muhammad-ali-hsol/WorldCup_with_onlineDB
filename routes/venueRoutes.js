const express=require('express');
const{generateVenue,getDetailsOfOneVenue,getDetailsOfAllVenue, updateVenue,getVenuesByName}=require('../controllers/venueController')
const {validateAdmin}=require('../middleware/adminAuth');

const venueRoutes=express.Router();

venueRoutes.post('/add', validateAdmin ,generateVenue);
venueRoutes.get('/showAll',getDetailsOfAllVenue);
venueRoutes.put('/update/:venueId/:venueCategoryId',validateAdmin, updateVenue);
venueRoutes.get('/details/:venueId',getDetailsOfOneVenue);
venueRoutes.get('/getVenuesName',getVenuesByName);

module.exports={venueRoutes};