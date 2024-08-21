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
});

OrderModel.associate=(models)=>{

    // Order Model Relationship with Compliance Model
    OrderModel.belongsTo(models.ComplianceModel, {
        as: 'userDetail',
        foreignKey: 'orderBy', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      // Order Model Relationship with Product Model
      OrderModel.belongsTo( models.ProductModel, {
        as: 'productDetail',
        foreignKey: 'productId', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      // Order Model Relationship with Order Track Model
      OrderModel.hasOne(models.OrderTrackModel, {
        as: 'orderDetail',
        foreignKey: 'orderId', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
}

module.exports = { OrderModel }