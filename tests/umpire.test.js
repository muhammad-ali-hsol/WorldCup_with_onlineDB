const request = require('supertest');
const app= require('../index');
const { redisClient,connectRedis,closeRedis } = require('../config/redisConnect');

let token=null;

beforeAll(async () => {
  try {
      await connectRedis();
      
      const exists = await redisClient.exists('token');
      // 1 means exist and 0 means not exist
      if (exists == 0) {
          const login = {
              email: "mali536356@gmail.com",
              password: "12345678"
          };
          const response = await request(app).post('/compliance/login').send(login);
          token = response.body.token;
          await redisClient.set('token', token, {
              EX: 60 * 60 * 24
          });
      } else {
          token = await redisClient.get('token');
      }
  } catch (error) {
      console.error('Error:', error);
  }
});

afterAll(async()=>{
  try{
      await closeRedis();
  }
  catch(error){
      console.error('Error:', error);
  }
});

describe('Umpire API', () => {

  describe("Get All Umpires", () => {
    it('should return 200  if it get Umpires', async () => {
      const response = await request(app).get('/umpire/showAll');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('umpireCategoryId');
      expect(response.body).toHaveProperty('umpires');
    });
  })

  // describe("Add Umpire", () => {
  //   // it('should create a new Umpire with status code 201 if identity Number is unique', async () => {
  //   //   const newUmpire = {
  //   //     identityName:"Syed Hussain Iqrar",
  //   //     imageURL:"https://media.licdn.com/dms/image/C4D03AQFMrkSIU9xjqQ/profile-displayphoto-shrink_200_200/0/1660660161359?e=2147483647&v=beta&t=W0Ya9KopW3FTSJUkvCpRqPYvL4W9IFOlvUqK18eV0dI",
  //   //     meta:{
  //   //         identityNumber:"56789896857",
  //   //         country:"Pakistan",
  //   //         age:23,
  //   //         totalMatchesAttended:1201
  //   //     }
  //   // }
  //   //   const response = (await request(app).post('/umpire/add').send(newUmpire)).set('token',token);
  //   //   expect(response.statusCode).toBe(201);
  //   // });
  //   it('should not create a new Umpire and return status code 409 if code is not unique', async () => {
  //       const newUmpire = {
  //           identityName:"Syed Hussain Iqrar",
  //           imageURL:"https://media.licdn.com/dms/image/C4D03AQFMrkSIU9xjqQ/profile-displayphoto-shrink_200_200/0/1660660161359?e=2147483647&v=beta&t=W0Ya9KopW3FTSJUkvCpRqPYvL4W9IFOlvUqK18eV0dI",
  //           meta:{
  //               identityNumber:"56789896857",
  //               country:"Pakistan",
  //               age:23,
  //               totalMatchesAttended:1201
  //           }
  //       }
  //     const response = await request(app).post('/umpire/add').send(newUmpire).set('token',token);
  //     expect(response.statusCode).toBe(409);
  //   });
  // });

  describe("Update Umpire ",()=>{
    it('should return 200 if data is valid and umpireId and umpireCategoryId is correct', async () => {
        const updatedUmpire = {
            identityName:"Syed Hussain Iqrar",
            imageURL:"https://media.licdn.com/dms/image/C4D03AQFMrkSIU9xjqQ/profile-displayphoto-shrink_200_200/0/1660660161359?e=2147483647&v=beta&t=W0Ya9KopW3FTSJUkvCpRqPYvL4W9IFOlvUqK18eV0dI",
            meta:{
                identityNumber:"56789896857",
                country:"Pakistan",
                age:23,
                totalMatchesAttended:1201
            }
        }
      const response = await request(app).put('/umpire/update/60/4').send(updatedUmpire).set('token',token);
      expect(response.statusCode).toBe(200);
    });
    // it('should return 404 if the venueId or venueCategory are not given or if it is incorrect or no data is provided', async () => {
    //     const updatedUmpire = {
    //         identityName:"Syed Hussain Iqrar",
    //         imageURL:"https://media.licdn.com/dms/image/C4D03AQFMrkSIU9xjqQ/profile-displayphoto-shrink_200_200/0/1660660161359?e=2147483647&v=beta&t=W0Ya9KopW3FTSJUkvCpRqPYvL4W9IFOlvUqK18eV0dI",
    //         meta:{
    //             identityNumber:"56789896857",
    //             country:"Pakistan",
    //             age:23,
    //             totalMatchesAttended:1201
    //         }
    //     }
    //   const response = await request(app).put('/umpire/update/2/6').send(updatedUmpire).set('token',token);
    //   expect(response.statusCode).toBe(404);
    // });
   
  })

  describe("Get Umpires Names", () => {
    it('should return 200  if it get Umpires Names', async () => {
      const response = await request(app).get('/umpire/getUmpiresName');
      expect(response.statusCode).toBe(200);
    });
  })

});