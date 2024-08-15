const { DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../config/dbConnect")
const  {orderStatus}= require('./enums');
const { ProductModel } = require("./product");
const { ComplianceModel } = require("./compliance");

const OrderModel = sequelize.define('order', {

    orderDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderStatus: {
        type: DataTypes.ENUM,
        values: Object.values(orderStatus),
        require: true,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: ProductModel,
            key: 'id',
        },
    },
    orderBy: {
        type: DataTypes.INTEGER,
        references: {
            model: ComplianceModel,
            key: 'id',
        },
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false
    }




}, {
    freezeTableName: true,
    timestamps: false
}

)

module.exports = { OrderModel }