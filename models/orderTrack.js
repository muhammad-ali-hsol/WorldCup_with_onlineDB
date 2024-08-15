const { DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../config/dbConnect")
const  {orderTrackingStatus}= require('./enums');
const { OrderModel } = require("./order");

const OrderTrackModel = sequelize.define('orderTrack', {

    expectedShippingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    trackingStatus: {
        type: DataTypes.ENUM,
        values:Object.values(orderTrackingStatus),
        require: true,
        allowNull: false
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: OrderModel,
            key: 'id',
        },
    },
}, {
    freezeTableName: true,
    timestamps: false
}

)

module.exports = { OrderTrackModel }