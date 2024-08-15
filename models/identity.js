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
}

)

module.exports = {IdentityModel}