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
}

)

module.exports = {CategoryModel}