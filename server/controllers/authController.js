const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json(400, { message: 'Please provide name, email, and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json(400, { message: 'User with this email already exists' });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.json(201, {
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json(400, { message: 'Please provide email and password' });
        }

        let user = await User.findOne({ email });
        
        // Development bypass: auto-create user if they don't exist, and ignore password checks
        if (!user) {
            user = await User.create({ 
                name: email.split('@')[0] || 'User', 
                email, 
                password: password || 'defaultpassword123' 
            });
        }

        const token = generateToken(user._id);

        res.json(200, {
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// GET /api/auth/me
const getMe = async (req, res) => {
    res.json(200, {
        user: { id: req.user._id, name: req.user.name, email: req.user.email }
    });
};

module.exports = { signup, login, getMe };
