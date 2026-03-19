const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Router = require('./utils/router');

// Load env vars
dotenv.config();

// Create router
const router = new Router();

// Register routes
require('./routes/authRoutes')(router);
require('./routes/expenseRoutes')(router);
require('./routes/budgetRoutes')(router);

// Create native HTTP server
const server = http.createServer((req, res) => {
    router.handleRequest(req, res);
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
