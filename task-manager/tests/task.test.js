//In order to prevent crash while testing, add runInBand option in JSON
const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');
const { resetDB,
        userOne, 
        userOneId,
        userTwo,
        userTwoId,
        taskOne,
        taskTwo,
        taskThree
    } = require('./fixtures/db');

beforeEach(resetDB);

test('Task should be saved', async () => {
    const task = await request(app)
                        .post('/tasks')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({
                            description: taskOne.description,
                            completed: taskOne.completed,
                            owner: taskOne.owner
                        })
                        .expect(201)
    const savedTask = await Task.findById(task.body._id);
    expect(savedTask).not.toBeNull();
})

test('User should get his/her own tasks', async () => {
    const tasks = await request(app)
                        .get('/tasks')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .expect(200);
                    
})

test('Should fail because of trying to delete others\' task', async() => {
    await request(app)
                        .delete(`/tasks/${taskOne._id}`)
                        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                        .expect(404);
    const presevedData = await Task.findById(taskOne._id);
    expect(presevedData).not.toBeNull();
})

test('User should get his/her own tasks', async () => {
    const tasks = await request(app)
                        .get('/tasks')
                        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                        .expect(200);
    expect(tasks.body).toHaveLength(2);
})