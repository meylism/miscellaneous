const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const userId = jwt.verify(token, process.env.JWT_SECRET_KEY)._id;
        //Try to learn the meaning of string query
        const user = await User.findOne({_id: userId, 'tokens.token': token});
        req.token = token;
        req.user = user;
        
        next();
    } catch(e) {
        res.status(401).send('Invalid login');
    }
}

module.exports = authenticate;