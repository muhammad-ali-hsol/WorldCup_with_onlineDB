const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.ONLINE_SQL_DB,process.env.ONLINE_SQL_USERNAME,process.env.ONLINE_SQL_PASSWORD,{
    host: process.env.ONLINE_SQL_HOST,
    dialect: 'mysql',
});

// const sequelize = new Sequelize('worldcup','u_worldcup','31EPfp32eaf2kfqaui98adj98d32j9d21M5yCv4rT',{
//         host: '34.101.101.182',
//         dialect: 'mysql',
//     });

const dbConnection = async () =>{
    try {
        await sequelize.authenticate();
        console.log('Db Connected');
    } catch (error) {
        console.log('Unable to connect db',error);
    }
}
const closeConnection = async () => {
    try {
      await sequelize.close();
      console.log('Db Connection Closed');
    } catch (error) {
      console.log('Error closing the database connection:', error);
    }
  };

module.exports={
    dbConnection, closeConnection,
    sequelize
}