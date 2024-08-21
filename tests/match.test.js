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
          console.log(token);
      } else {
          token = await redisClient.get('token');
          console.log(token);
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

describe('Match APIs', () => {

    describe('Create Matches', () => {
        it('should create a match and return 201', async () => {
            const matchData = {
                date: '2024-08-22',
                time:'12:30',
                team1: 3,
                team2: 2,
                umpire1: 3,
                umpire2: 4,
                venue: 5,
                matchName:'test Match'
            };

            const response = await request(app)
                .post('/match/create').send(matchData).set('token',token);

            expect(response.statusCode).toBe(201);
        });
    });

    describe('GET all matches of one team by teamId', () => {
        it('should return matches by team ID and return 200', async () => {

            const response = await request(app)
                .get(`/match/showMatches/2`);

            expect(response.statusCode).toBe(200);
            // expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET match details by match Id', () => {
        it('should return match details by match ID and return 200', async () => {

            const response = await request(app)
                .get("/match/show/1");
            expect(response.statusCode).toBe(200);
        });
    });

    describe('GET all Matches', () => {
        it('should return all matches and return 200', async () => {
            const response = await request(app)
                .get("/match/showAll");

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('PUT /matches/:matchId', () => {
        it('should update a match and return 200', async () => {
            const matchData = {
                date: '2024-08-28',
                time:'12:30',
                team1: 3,
                team2: 2,
                umpire1: 3,
                umpire2: 4,
                venue: 5,
                matchName:'test Match'
            };

            const response = await request(app)
                .put("/match/update/1")
                .send(matchData).set('token',token);

            expect(response.statusCode).toBe(200);
            // expect(response.body).toBe(`Match with ID ${matchId} has been updated`);
        });
    });

    // describe('PUT /matches/:matchId/won', () => {
    //     it('should update the won status of a match and return 200', async () => {
    //         const matchId = 1;
    //         const data = {
    //             teamId: 1,
    //         };

    //         const response = await request(app)
    //             .put(`/matches/${matchId}/won`)
    //             .send(data);

    //         expect(response.status).toBe(200);
    //         expect(response.body).toBe('Match Status Updated Successfully');
    //     });
    // });
});
