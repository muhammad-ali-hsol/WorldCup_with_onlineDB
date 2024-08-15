const request = require('supertest');
const  app = require('../index');
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


describe("Players API",()=>{

    it('should create a new player successfully', async () => {
        const playerData = {
            identityName:"Imran Khan",
            imageURL:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.espncricinfo.com%2Fcricketers%2Fchris-gayle-51880&psig=AOvVaw0U173ewg8GpXBZuZeMF2Bp&ust=1722452510529000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLCD2-K5z4cDFQAAAAAdAAAAABAQ",
            meta:{
                identityNumber:"11111776676",
                personalDetails:{
                    age:70,
                    height:"6'4'' (200cm)",
                    weight:"100kg"
                },
                totalMatchesPlayed:1000,
                role:"batsman"
            }
        }
        const response = await request(app).post(`/player/add/2`).send(playerData).set('token',token);
        expect(response.statusCode).toBe(201);

    });

    it('should update a player successfully with 200 statusCode', async () => {
        const updatedPlayerData = {
            id:39,
            identityName:"Azam Khan",
            imageURL:"https://www.pcb.com.pk/timthumb.php?src=images/news_images/featured_images/0e09cf37c9f2.jpg&w=675",
            meta:{
                identityNumber:"00000012",
                age:24,
                height:"6'4'' (200cm)",
                weight:"100kg",
                totalMatchesPlayed:1000,
                role:"batsman"
            }
        }
        const response = await request(app).put(`/player/update/39`).send(updatedPlayerData).set('token',token);
        expect(response.statusCode).toBe(200);
    });

});