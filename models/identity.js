const {DataTypes, STRING} = require("sequelize");
const {sequelize} = require("../config/dbConnect");
const { CategoryModel } = require("./category");


const IdentityModel = sequelize.define('identity',{

    identityName:{
        type:DataTypes.STRING,
        require:true,
        allowNull:false
    },
    imageURL:{
        type:DataTypes.STRING,
        require:true,
        allowNull:false
    },
    parentId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    meta:{
        type:DataTypes.JSON,
        allowNull:true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: CategoryModel,
            key: 'id',
        },
    },


  
},{
    freezeTableName: true,
    timestamps:false
});

IdentityModel.associate = (models) => {

     // Identity Category Relationship
    IdentityModel.belongsTo(models.CategoryModel, {
      foreignKey: 'categoryId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // Identity Match Relationships
    IdentityModel.hasMany(models.MatchModel, {
        as: 'team1Detail',
        foreignKey: 'team1', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      IdentityModel.hasMany(models.MatchModel, {
        as: 'team2Detail',
        foreignKey: 'team2', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      IdentityModel.hasMany(models.MatchModel, {
        as: 'umpire1Detail',
        foreignKey: 'umpire1', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      IdentityModel.hasMany(models.MatchModel, {
        as: 'umpire2Detail',
        foreignKey: 'umpire2', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      IdentityModel.hasMany(models.MatchModel, {
        as: 'venueDetail',
        foreignKey: 'venue', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      IdentityModel.hasMany(models.MatchModel, {
        as: 'wonDetail',
        foreignKey: 'won', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      // Identity Model Self Relation
      IdentityModel.hasMany(models.IdentityModel, {
        as: 'players', 
        foreignKey: 'parentId' });
     
     IdentityModel.belongsTo(models.IdentityModel, {
        as: 'team',
        foreignKey: 'parentId' });
     
    
  };

module.exports = {IdentityModel}