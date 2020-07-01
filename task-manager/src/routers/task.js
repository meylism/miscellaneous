const express = require('express');
const authenticate = require('../middleware/auth');
const Task = require('../models/Task');

const routerTask = new express.Router();

routerTask.post('/tasks', authenticate, async (req, res) => {
    const newTask = new Task({...req.body, owner: req.user._id});
    try {
        const data = await newTask.save();
        res.status(201).send(data);
    } catch(e) {
        res.status(400).send(e); 
    }
})
/*
Based on completion: /tasks?completed=true
Pagination: /tasks?limit=10&skip=10
Sorting: /tasks?sortBy=completed:asc or desc
*/

routerTask.get('/tasks', authenticate, async (req, res) => {
    const match = {}
    if(req.query.completed) match.completed = req.query.completed ==='true';
    const sort= {};
    if(req.query.sortBy) {
        const sortItems = req.query.sortBy.split(':');
        sort[sortItems[0]] = sortItems[1]==='asc' ? 1 : -1;
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();
    }
})

routerTask.get('/tasks/:id', authenticate, async (req, res) => {
    const _id = req.params.id;
    try {
        const data = await Task.findOne({_id, owner: req.user._id});
        if(!data) return res.status(404).send();
        res.send(data);
    } catch(e) {
        res.status(500).send();
    }
})

routerTask.patch('/tasks/:id', authenticate, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every(value => {
        return allowedUpdates.includes(value);
    })
    if(!isValid) return res.status(400).send('You are not allowed to update these fields.');
    try {
        const data = await Task.findOneAndUpdate({_id: req.params.id, owner: req.user._id}, req.body, {new: true, runValidators: true});
        if(!data) res.status(404).send();
        res.send(data);
    } catch(e) {
        res.status(500).send();
    }
})

routerTask.delete('/tasks/:id', authenticate, async (req, res) => {
    try {
        const data = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!data) return res.status(404).send();
        res.send(data);
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = routerTask;