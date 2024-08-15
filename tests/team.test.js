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

describe("Teams API", () => {

    describe("Create Team", () => {
        it('should create a new Team with status code 201 if Team Name is unique', async () => {
            const newTeam = {
                identityName: "Saudia Arabia",
                imageURL: "https://www.arabnews.pk/sites/default/files/userimages/4264931/f6-2mu1buaag5rm.jpg",
                meta: {
                    description: "Jeevay Jeevay ... Jeevay Saudia Saudia Pakistan Jeevay Pakistan "
                }
            };
            const response = await request(app).post('/team/add').send(newTeam).set('token', token);
            expect(response.statusCode).toBe(201);
        });

        it('should return status code 409 if Team Name already exists', async () => {
            const existingTeam = {
                identityName: "Pakistan", 
                imageURL: "https://www.arabnews.pk/sites/default/files/userimages/4264931/f6-2mu1buaag5rm.jpg",
                meta: {
                    description: "Existing Team Description"
                }
            };
            const response = await request(app).post('/team/add').send(existingTeam).set('token', token);
            expect(response.statusCode).toBe(409);
        });

        it('should return status code 403 if Team details are not provided', async () => {
            const response = await request(app).post('/team/add').send({}).set('token', token);
            expect(response.statusCode).toBe(403);
        });
    });

    describe("Return All Teams", () => {
        it("it will return all teams with statusCode 200", async () => {
            const response = await request(app).get('/team/showAll');
            expect(response.statusCode).toBe(200);
        },6000);

        // it("it will return status code 404 if no teams exist", async () => {
        //     const response = await request(app).get('/team/showAll');
        //     expect(response.statusCode).toBe(404);
        // });
    });

    describe("Return Any Six Teams", () => {
        it("it will return six teams with statusCode 200", async () => {
            const response = await request(app).get('/team/showSix');
            expect(response.statusCode).toBe(200);
        });

        // it("it will return status code 404 if no teams exist", async () => {
        //     const response = await request(app).get('/team/showSix');
        //     expect(response.statusCode).toBe(404);
        // });
    });

    describe("Return All Players details of one team", () => {
        it("it will return all Players details of one team with statusCode 200", async () => {
            const response = await request(app).get('/team/players/2');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('team');
            expect(response.body).toHaveProperty('players');
        });

        it("it will return status code 404 if team ID is not given", async () => {
            const response = await request(app).get('/team/players/');
            expect(response.statusCode).toBe(404);
        });

        it("it will return status code 404 if no players are found for the given team ID", async () => {
            const response = await request(app).get('/team/players/9999');  
        });
    });

    describe("Update Team", () => {
        // it("will return 201 if all things go well and the team is updated", async () => {
        //     const updatedTeam = {
        //         identityName: "Pakistan",
        //         imageURL: "https://www.arabnews.pk/sites/default/files/userimages/4264931/f6-2mu1buaag5rm.jpg",
        //         meta: {
        //             description: "Jeevay Jeevay Pakistan"
        //         }
        //     };
        //     const response = await request(app).post('/team/update/100').send(updatedTeam).set('token', token);
        //     expect(response.statusCode).toBe(201);
        // });

        it("will return status code 404 if Team ID or Category ID is not provided", async () => {
            const updatedTeam = {
                identityName: "Pakistan",
                imageURL: "https://www.arabnews.pk/sites/default/files/userimages/4264931/f6-2mu1buaag5rm.jpg",
                meta: {
                    description: "Jeevay Jeevay Pakistan"
                }
            };
            const response = await request(app).post('/team/update/2').send(updatedTeam).set('token', token);
            expect(response.statusCode).toBe(404);
        });

        it("will return status code 404 if the team does not exist", async () => {
            const updatedTeam = {
                identityName: "Pakistan",
                imageURL: "https://www.arabnews.pk/sites/default/files/userimages/4264931/f6-2mu1buaag5rm.jpg",
                meta: {
                    description: "Jeevay Jeevay Pakistan"
                }
            };
            const response = await request(app).post('/team/update/9999/2').send(updatedTeam).set('token', token); 
            expect(response.statusCode).toBe(404);
        });
    });

    describe("Get Teams By Names", () => {
        it("should return a list of teams with status code 200", async () => {
            const response = await request(app).get('/team/getTeamsName');
            expect(response.statusCode).toBe(200);
        });

        // it("should return status code 404 if no teams exist", async () => {
        //     const response = await request(app).get('/team/getTeamsName');
        //     expect(response.statusCode).toBe(404);
        // });
    });
});
