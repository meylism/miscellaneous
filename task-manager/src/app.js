const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('./db/mongoose');
const routerUser = require('./routers/user');
const routerTask = require('./routers/task');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const User = require('./models/User');

const app = express();

app.use(express.json())
app.use(routerUser);
app.use(routerTask);


module.exports = app;
