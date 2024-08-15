const redis = require("redis"); 

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
  });
  
//   const redisConnect = async () => {

//     redisclient.on("error", (err) => { 
//       console.log("Redis Client Error:", err); 
//     });
  
//     try {
//       await redisclient.connect();
//       console.log("Connecting to Redis...");
//     } catch (error) {
//       console.error("Failed to connect to Redis:", error);
//     }
  
   
//     redisclient.on("ready", () => { 
//       console.log("Connected to Redis!"); 
//     });
//   };
  


//   const redisClose = async () => {
//     try {
//       await redisclient.quit();
//       console.log("Redis connection closed.");
//     } catch (error) {
//       console.error("Error closing Redis connection:", error);
//     }
//   };

// const setTokenKey = (token, callback) => {
//   redisclient.set('token', token, (err, reply) => {
//     if (err) {
//       console.error('Error setting token:', err);
//       if (callback) callback(err, null);
//     } else {
//       console.log('Token set:', reply);
//       if (callback) callback(null, reply);
//     }
//   });
// };

// // const getTokenKey = (callback) => {
// //   redisclient.get('token', (err, reply) => {
// //     if (err) {
// //       console.error('Error getting token:', err);
// //       if (callback) callback(err, null);
// //     } else {
// //       console.log('Token retrieved:', reply);
// //       if (callback) callback(null, reply);
// //     }
// //   });
// // };

// const getTokenKey = () => {
//     return new Promise((resolve, reject) => {
//         redisclient.get('token', (err, reply) => {
//         if (err) {
//            reject(err);
//         } else {
//             resolve(reply); 
//         }
//         });
//         // getTokenKey((err, authToken) => {
//         //     if (err) {
//         //         reject(err);
//         //     } else {
//         //         resolve(authToken);
//         //     }
//         // });
//     });
// };

// module.exports={setTokenKey,getTokenKey,redisConnect,redisClose};


const connectRedis=async()=> {
    try {
        await redisClient.connect();
        console.log('Redis connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to Redis:', error);
    }
}


const closeRedis=async()=> {
    try {
        await redisClient.quit();
        console.log('Redis connection has been closed successfully.');
    } catch (error) {
        console.error('Unable to close Redis connection:', error);
    }
}

module.exports = { connectRedis, closeRedis, redisClient };