const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { resetDB,
        userOne, 
        userOneId
    } = require('./fixtures/db');

beforeEach(resetDB)

test('Should sign up', async () => {
    await request(app)
                        .post('/users')
                        .send({
                            name: 'Meylis',
                            surname: 'Meylis',
                            email: 'meylsmatiyev20@gmail.com',
                            password: '1231ffg23'
                        }).expect(201);                        
})

test('Should login', async () => {
    const newUser = await request(app)
                        .post('/users/login')
                        .send({
                            email: userOne.email,
                            password: userOne.password
                        }).expect(200);
    //This is the test to make sure that new token is concatenated with tokens array                        
    const user = await User.findById(userOneId);
    expect(user.tokens[user.tokens.length-1].token).toBe(newUser.body.token)
})

test('Should not login - nonexis. user', async () => {
    await request(app)
                        .post('/users/login')
                        .send({
                            email: userOne.email,
                            password: 'thisispasswordforuserOne'
                        }).expect(400)
})

test('Should read the profile', async () => {
    await request(app)
                        .get('/users/me')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .expect(200)
})

test('Should not read profile - 401', async () => {
    await request(app)
                        .get('/users/me')
                        .expect(401)
})

test('Should delete profile', async () => {
    const deletedUser = await request(app)
                        .delete('/users/me')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .expect(200)
    //Make sure that user is really removed
    const user = await User.findById(deletedUser.body._id);
    expect(user).toBeNull();
})

test('Should not delete profile', async () => {
    await request(app)
                        .delete('/users/me')
                        .expect(401)
})

test('Should upload avatar', async () => {
    const user = await request(app)
                        .post('/users/me/avatar')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        //Adress for the attach starts from the root file
                        .attach('avatar', './tests/fixtures/meylis.jpg')
                        .expect(200);
    //To check avatar is really stored as a Buffer
    const userData = await User.findById(userOneId)
    expect(userData.avatar).toEqual(expect.any(Buffer));
})

test('Should update valid fields', async () => {
    const user = await request(app)
                                    .patch('/users')
                                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                                    .send({
                                        name: 'Meyy',
                                        password: 'newnewnew'
                                    }).expect(200);
})

test('Should not update note allowed and nonexis. fields', async () => {
    const user = await request(app)
                                    .patch('/users')
                                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                                    .send({
                                        _id: 'Meyy',
                                        location: 'Ashgabat'
                                    }).expect(400);
})