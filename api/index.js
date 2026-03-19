const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

const connectDB = require('../server/config/db');
const Router = require('../server/utils/router');

// Create router and register routes
const router = new Router();
require('../server/routes/authRoutes')(router);
require('../server/routes/expenseRoutes')(router);
require('../server/routes/budgetRoutes')(router);

let isConnected = false;

module.exports = async (req, res) => {
  // Connect to MongoDB on first request (serverless cold start)
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Database connection failed' }));
      return;
    }
  }

  // Route the request through our custom router
  await router.handleRequest(req, res);
};
