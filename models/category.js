const {DataTypes, STRING} = require("sequelize");
const {sequelize} = require("../config/dbConnect")

const CategoryModel = sequelize.define('category',{
   
   categoryName:{
        type:DataTypes.STRING,
        allowNull:false
   },
    createdBy:{
        type:DataTypes.STRING,
        allowNull:false
    },
    updatedBy:{
        type:DataTypes.STRING,
        allowNull:true
    }

  
},{
    freezeTableName: true,
    timestamps:false
});

CategoryModel.associate = (models) => {
    // Category Model Relationship with Identity Model
    CategoryModel.hasMany(models.IdentityModel, {
        foreignKey: 'categoryId',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      // Category Model Relationship with Compliance Model
      CategoryModel.hasMany(models.ComplianceModel, {
        foreignKey: 'categoryId',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
}

module.exports = {CategoryModel}