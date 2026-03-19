const auth = require('../middleware/auth');
const { signup, login, getMe } = require('../controllers/authController');

const registerAuthRoutes = (router) => {
    router.post('/api/auth/signup', signup);
    router.post('/api/auth/login', login);
    router.get('/api/auth/me', auth, getMe);
};

module.exports = registerAuthRoutes;
