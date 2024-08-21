const express = require('express');
require('dotenv').config();
const { CategoryModel } = require('./models/category');
const { IdentityModel } = require('./models/identity');
const { MatchModel } = require('./models/match');
const { ComplianceModel } = require('./models/compliance');
const { ProductModel } = require('./models/product');
const { OrderModel } = require('./models/order');
const { OrderTrackModel } = require('./models/orderTrack');
const { categoryRoutes } = require('./routes/categoryRoutes')
const { adminRoutes } = require('./routes/adminRoutes')
const { teamRoutes } = require('./routes/teamRoute')
const { playerRoutes } = require('./routes/playerRoute')
const { umpireRoutes } = require('./routes/umpireRoute')
const { venueRoutes } = require('./routes/venueRoutes')
const { matchRoutes } = require('./routes/matchRoutes');
const { productRoutes } = require('./routes/productRoutes');
const cors=require('cors');  


const app = express();
app.use(cors());
app.use(express.json());


app.use('/category', categoryRoutes)
app.use('/compliance', adminRoutes)
app.use('/team', teamRoutes)
app.use('/player',playerRoutes)
app.use('/umpire',umpireRoutes)
app.use('/venue',venueRoutes)
app.use('/match',matchRoutes)
app.use('/product',productRoutes)



const models = {
      CategoryModel,
      IdentityModel,
      MatchModel,
      ComplianceModel,
      ProductModel,
      OrderModel,
      OrderTrackModel,
    };

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});


CategoryModel.sync({ force: false });
ComplianceModel.sync({ force: false });
IdentityModel.sync({ force: false });
MatchModel.sync({ force: false });
ProductModel.sync({ force: false });
OrderModel.sync({ force: false });
OrderTrackModel.sync({ force: false });


module.exports=app;