const { DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../config/dbConnect")

const ProductModel = sequelize.define('product', {

    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    productCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageURL: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
    }
},

    {
        freezeTableName: true,
        timestamps: false
    });

ProductModel.associate = (models) => {

     // Product Model Relationship with Order Model
    ProductModel.hasMany(models.OrderModel, {
        as: 'productDetail',
        foreignKey: 'productId', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
}

module.exports = { ProductModel }