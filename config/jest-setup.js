const {  dbConnection } = require('./dbConnect');
const {  connectRedis,redisClient } = require('./redisConnect');

module.exports = async () => {
    await dbConnection();
    // await connectRedis();
};