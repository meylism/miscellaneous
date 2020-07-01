const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        validate(age) {
            if(age < 0) throw new Error('Age must be greater than 0');
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(email) {
            if(!validator.isEmail(email)) throw new Error('Email is not valid.')
        }
    },
    password: {
        type: String,
        minlength: 7,
        required: true,
        validate(password) {
            if(password.includes('password')) throw new Error("Password cannnot contain 'password'");
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;
    const data = await Task.deleteMany({owner: user._id});
    next();
})

userSchema.statics.findByCredentials = async ({email, password}) => {
    const user = await User.findOne({email});
    //User is not found
    if(!user) throw new Error('Invalid login credentials!');
    //Password is not correct
    if(!await bcrypt.compare(password, user.password)) throw new Error('Invalid login credentials!');
    //Ever. is OK. Send data
    return user;
}

userSchema.methods.generateToken = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_KEY);
    //NOTEEEEEEEE! concat returns new array
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function() {
    let data = this.toObject();
    delete data.password;
    delete data.tokens;
    //It is a good idea to hide avatar buffer since it is not useful anymore
    delete data.avatar;
    return data;
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model('User', userSchema);


module.exports = User;