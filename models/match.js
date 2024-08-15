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
}

)

module.exports = { MatchModel }