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

describe('Venue API', () => {

  describe("Get All Venues", () => {
    it('should return 200  if it get Venues', async () => {
      const response = await request(app).get('/venue/showAll');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('venueCategoryId');
      expect(response.body).toHaveProperty('venues');
    });
  })

  describe("Create Venue", () => {
    // it('should create a new Venue with status code 201 if code is unique', async () => {
    //   const newVenue = {
    //     identityName: "Lahore Sports Complex",
    //     imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpDU8blEi6xhKNwENKi_33ZkyA1DA1X3xcnQ&s",
    //     meta: {
    //       code: 2010,
    //       location: "Pakitan",
    //       capacity: 10000
    //     }
    //   }
    //   const response = await request(app).post('/venue/add').send(newVenue).set('token',token);
    //   expect(response.statusCode).toBe(201);
    // });
    it('should not create a new Venue and return status code 409 if code is not unique', async () => {
      const newVenue = {
        id:0,
        identityName: "Lahore Sports Complex",
        imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpDU8blEi6xhKNwENKi_33ZkyA1DA1X3xcnQ&s",
        meta: {
          code: 2014,
          location: "Pakitan",
          capacity: 10000
        }
      }
      const response = await request(app).post('/venue/add').send(newVenue).set('token',token);
      expect(response.statusCode).toBe(409);
    });
  });

  describe("Get One Venue ",()=>{
    it('should return 200 if the venueId is correct if it get Venue', async () => {
      const response = await request(app).get('/venue/details/42');
      expect(response.statusCode).toBe(200);
    });
    it('should return 404 if the venueId is not provided or incorrect ', async () => {
      const response = await request(app).get('/venue/details/3');
      expect(response.statusCode).toBe(404);
    });
  })

  describe("Update Venue ",()=>{
    it('should return 200 if data is valid and venueId and venuecategoryId is correct', async () => {
      const updateVenue = {
        id:55,
        identityName: "Sydney Cricket Stadium",
        imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpDU8blEi6xhKNwENKi_33ZkyA1DA1X3xcnQ&s",
        meta: {
          code:2014,
          location: "Sydney",
          capacity: 10000
        }
      }
      const response = await request(app).put('/venue/update/55/6').send(updateVenue).set('token',token);
      expect(response.statusCode).toBe(200);
    });
    it('should return 403 for Validation Error', async () => {
      const updateVenue = {
        id:55,
        // identityName: "Lahore Sports Complex Saga",
        imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpDU8blEi6xhKNwENKi_33ZkyA1DA1X3xcnQ&s",
        meta: {
          // code:2010,
          location: "Pakitan",
          capacity: 10000
        }
      }
      const response = await request(app).put('/venue/update/53/6').send(updateVenue).set('token',token);
      expect(response.statusCode).toBe(403);
    });

  })

  describe("Get Venues Names", () => {
    it('should return 200  if it get Venues Names', async () => {
      const response = await request(app).get('/venue/getVenuesName');
      expect(response.statusCode).toBe(200);
    });
  })

});