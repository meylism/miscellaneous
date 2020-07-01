const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

//I create JWT myself to test cases where auth. is needed
const userOneId = mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Meylis',
    surname: 'Matiyev',
    email: 'meylisunk@gmail.com',
    password: '1234mypass',
    tokens: [{
        token: JWT.sign({_id: userOneId}, process.env.JWT_SECRET_KEY)
    }]
}

const userTwoId = mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Meylis2',
    surname: 'Matiyev2',
    email: 'meylisunk2@gmail.com',
    password: '1234mypass2',
    tokens: [{
        token: JWT.sign({_id: userTwoId}, process.env.JWT_SECRET_KEY)
    }]
}

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    description: 'Do up the house!',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    description: 'Do up the house!',
    completed: false,
    owner: userTwoId
}

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    description: 'Do up the house!',
    completed: false,
    owner: userTwoId
}

const resetDB = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    const user1 = new User(userOne);
    const user2 = new User(userTwo);
    const task1 = new Task(taskOne);
    const task2 = new Task(taskTwo);
    const task3 = new Task(taskThree);
    await user1.save();
    await user2.save();
    await task1.save();
    await task2.save();
    await task3.save();
}

module.exports = {
    resetDB,
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree
}
