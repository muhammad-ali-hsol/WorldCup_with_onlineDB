const request = require('supertest');
const app = require('../index');
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

describe("Create User Or Admin", () => {
    it('should create a new User or Admin with status code 201 if email is unique', async () => {
      const newUser={
        complianceName:"Muhammad Zaeem",
        email:"zaeem@gmail.com",
        password:"12345678"
     }
      const response = await request(app).post('/compliance/create/7').send(newUser).set('token',token);
      expect(response.statusCode).toBe(201);
    });
   
  });