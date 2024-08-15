const {  closeConnection } = require('./dbConnect');
const {  closeRedis,redisClient } = require('./redisConnect');

module.exports = async () => {
    await closeConnection();
    // await closeRedis();
};