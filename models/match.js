const { DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../config/dbConnect")
const { IdentityModel } = require('./identity');


const MatchModel = sequelize.define('match', {

    matchName: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false
    },
    // Made changes on July 31st

    // country: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // stadium: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
     // day: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    team1: {
        type: DataTypes.INTEGER,
        references: {
            model: IdentityModel,
            key: 'id',
        },
    },
    team2: {
        type: DataTypes.INTEGER,
        references: {
            model: IdentityModel,
            key: 'id',
        },
    },
    umpire1: {
        type: DataTypes.INTEGER,
        references: {
            model: IdentityModel,
            key: 'id',
        },
    },
    umpire2: {
        type: DataTypes.INTEGER,
        references: {
            model: IdentityModel,
            key: 'id',
        },
    },
    // Added on 31st july
    venue: {
        type: DataTypes.INTEGER,
        references: {
            model: IdentityModel,
            key: 'id',
        },
    },
    // Added on 5th August
    won: {
        type: DataTypes.INTEGER,
        references: {
            model: IdentityModel,
            key: 'id',
        },
    },

}, {
    freezeTableName: true,
    timestamps: false
});

MatchModel.associate=(models)=>{

    // Match Model Relationship with Identity Model
    
    MatchModel.belongsTo(models.IdentityModel, {
        as: 'team1Detail',
        foreignKey: 'team1', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      MatchModel.belongsTo(models.IdentityModel, {
        as: 'team2Detail',
        foreignKey: 'team2', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      MatchModel.belongsTo(models.IdentityModel, {
        as: 'umpire1Detail',
        foreignKey: 'umpire1', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      MatchModel.belongsTo(models.IdentityModel, {
        as: 'umpire2Detail',
        foreignKey: 'umpire2', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      MatchModel.belongsTo(models.IdentityModel, {
        as: 'venueDetail',
        foreignKey: 'venue', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      MatchModel.belongsTo(models.IdentityModel, {
        as: 'wonDetail',
        foreignKey: 'won', onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
}

module.exports = { MatchModel }