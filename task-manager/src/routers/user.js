const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const authenticate = require('../middleware/auth');
const User = require('../models/User');
const {sendWelcomeEmail, sendCancellationEmail} = require('../email/email');

const routerUser = new express.Router();

routerUser.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateToken();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user, token});
    } catch(e) {
        res.status(400).send(e);
    }
})

routerUser.get('/users/me', authenticate, async (req, res) => {
    res.send(req.user);
})

routerUser.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body);
        const token = await user.generateToken(); 
        res.send({user, token});
    } catch(e) {
        res.status(400).send(e);
    }
})

routerUser.post('/users/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
})

routerUser.post('/users/logoutAll', authenticate,  async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
        //If the user tries to logout all and there aren't any users who have already logged in,
        //it will return error(500);
    } catch(e) {
        res.status(500).send(e);
    }
})

routerUser.patch('/users', authenticate, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'surname', 'email', 'password', 'age'];
    const isValid = updates.every(value => {
        return allowedUpdates.includes(value);
    })
    if(!isValid) return res.status(400).send('You are not allowed to update these fields.');
    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

routerUser.delete('/users/me', authenticate,  async (req, res) => {
    try {
        const data = await req.user.remove();
        sendCancellationEmail(data.email, data.name);
        res.send(data);
    } catch(e) {
        res.status(500).send(e);
    }
})

const uploadAvatar = multer({
    //I want Express handle my file. So, I omit dest property
    //dest: 'avatars',
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|png)$/)) return cb(new Error('Please upload picture!'));
        //This is an additional option to pass file
        //req.avatar = file;
        cb(null, true);
    }
})

//NOTE! If you specify dest, express will not be able to handle file.
//If you omit dest, then multer will pass file to the req object. (req.file)
//Pay attention how we handle errors
routerUser.post('/users/me/avatar', authenticate, uploadAvatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})

routerUser.delete('/users/me/avatar', authenticate, async (req, res) => {
    //delete req.user.avatar; I don't know why this is not working
    req.user.avatar = undefined; 
    await req.user.save();
    res.send();
})

routerUser.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) throw new Error();
        //By default, Express sets header 'Content-Type = application/json'
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(e) {
        res.status(404).send();
    }
})


module.exports = routerUser;