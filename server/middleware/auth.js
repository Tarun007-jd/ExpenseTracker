const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.json(401, { message: 'Access denied. No token provided.' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            res.json(401, { message: 'Token is invalid. User not found.' });
            return;
        }

        req.user = user;
    } catch (error) {
        res.json(401, { message: 'Token is invalid or expired.' });
    }
};

module.exports = auth;
