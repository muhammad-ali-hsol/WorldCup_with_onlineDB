const express = require('express');
require('dotenv').config();
const {sequelize}=require('./config/dbConnect');
const { dbConnection } = require('./config/dbConnect');
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
const _PORT = process.env.PORT;  

const app = express();
app.use(cors());
app.use(express.json());

// (async()=>{
//   try{
//     await dbConnection();
//     await redisConnect();
//   }
//   catch(error){
//     console.log(error)
//   }
// })(); 




app.use('/category', categoryRoutes)
app.use('/compliance', adminRoutes)
app.use('/team', teamRoutes)
app.use('/player',playerRoutes)
app.use('/umpire',umpireRoutes)
app.use('/venue',venueRoutes)
app.use('/match',matchRoutes)
app.use('/product',productRoutes)


// Category Model relation with IdentityModel Model
CategoryModel.hasMany(IdentityModel, {
  foreignKey: 'categoryId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
IdentityModel.belongsTo(CategoryModel, {
  foreignKey: 'categoryId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});


// Match Model relation with IdentityModel Model
IdentityModel.hasMany(MatchModel, {
  as: 'team1Detail',
  foreignKey: 'team1', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
IdentityModel.hasMany(MatchModel, {
  as: 'team2Detail',
  foreignKey: 'team2', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
IdentityModel.hasMany(MatchModel, {
  as: 'umpire1Detail',
  foreignKey: 'umpire1', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
IdentityModel.hasMany(MatchModel, {
  as: 'umpire2Detail',
  foreignKey: 'umpire2', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

MatchModel.belongsTo(IdentityModel, {
  as: 'team1Detail',
  foreignKey: 'team1', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
MatchModel.belongsTo(IdentityModel, {
  as: 'team2Detail',
  foreignKey: 'team2', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
MatchModel.belongsTo(IdentityModel, {
  as: 'umpire1Detail',
  foreignKey: 'umpire1', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
MatchModel.belongsTo(IdentityModel, {
  as: 'umpire2Detail',
  foreignKey: 'umpire2', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});


// Category Model Relation with Compliance Model
CategoryModel.hasMany(ComplianceModel, {
  foreignKey: 'categoryId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

ComplianceModel.belongsTo(CategoryModel, {
  foreignKey: 'categoryId', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});


// Match Model Venue Relatioship with Identity Model  ... Added on 31st JULY
IdentityModel.hasMany(MatchModel, {
  as: 'venueDetail',
  foreignKey: 'venue', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
MatchModel.belongsTo(IdentityModel, {
  as: 'venueDetail',
  foreignKey: 'venue', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// self relation of Identity Model between players and team  4th August Weekend
IdentityModel.hasMany(IdentityModel, {
   as: 'players', 
   foreignKey: 'parentId' });

IdentityModel.belongsTo(IdentityModel, {
   as: 'team',
   foreignKey: 'parentId' });

// These changes are done as i checked em

// Won Details Attached 5 August
IdentityModel.hasMany(MatchModel, {
  as: 'wonDetail',
  foreignKey: 'won', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
MatchModel.belongsTo(IdentityModel, {
  as: 'wonDetail',
  foreignKey: 'won', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Order Attach with Product and Compliance 7 August
ComplianceModel.hasMany(OrderModel, {
  as: 'userDetail',
  foreignKey: 'orderBy', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
OrderModel.belongsTo(ComplianceModel, {
  as: 'userDetail',
  foreignKey: 'orderBy', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

ProductModel.hasMany(OrderModel, {
  as: 'productDetail',
  foreignKey: 'productId', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
OrderModel.belongsTo( ProductModel, {
  as: 'productDetail',
  foreignKey: 'productId', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Order Attach with Order Track  7 August

OrderModel.hasOne(OrderTrackModel, {
  as: 'orderDetail',
  foreignKey: 'orderId', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
OrderTrackModel.belongsTo( OrderModel, {
  as: 'orderDetail',
  foreignKey: 'orderId', onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});




CategoryModel.sync({ force: false });
ComplianceModel.sync({ force: false });
IdentityModel.sync({ force: false });
MatchModel.sync({ force: false });
ProductModel.sync({ force: false });
OrderModel.sync({ force: false });
OrderTrackModel.sync({ force: false });


app.listen(_PORT, async () => {
  console.log(`server is listening on port : ${_PORT}`);
  await dbConnection();
})

module.exports=app;