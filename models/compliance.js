const { DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const { CategoryModel } = require("./category");

const ComplianceModel = sequelize.define('compliance', {


    complianceName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: CategoryModel,
            key: 'id',
        },
    },


}, {
    freezeTableName: true,
    timestamps: false
});

ComplianceModel.associate = (models) => {

    // Compliance Model Relationship with Category Model
    ComplianceModel.belongsTo(models.CategoryModel, {
        foreignKey: 'categoryId', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    // Compliance Model Relationship with Order Model
    ComplianceModel.hasMany(models.OrderModel, {
        as: 'userDetail',
        foreignKey: 'orderBy', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
}

module.exports = { ComplianceModel }