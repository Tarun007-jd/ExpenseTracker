const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Router = require('./utils/router');

// Load env vars
dotenv.config();

// Create router
const router = new Router();

// Register API routes
require('./routes/authRoutes')(router);
require('./routes/expenseRoutes')(router);
require('./routes/budgetRoutes')(router);

// ===== Static File Serving for Production =====
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'client', 'dist');

function serveStaticFile(req, res) {
  // Try to serve the exact file requested
  let filePath = path.join(CLIENT_BUILD_PATH, req.path === '/' ? 'index.html' : req.path);

  // Security: prevent directory traversal
  if (!filePath.startsWith(CLIENT_BUILD_PATH)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found → serve index.html for SPA routing
      filePath = path.join(CLIENT_BUILD_PATH, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}

// Create native HTTP server
const server = http.createServer(async (req, res) => {
  const url = require('url');
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API routes → router
  if (pathname.startsWith('/api/')) {
    return router.handleRequest(req, res);
  }

  // Everything else → static files / SPA fallback
  req.path = pathname;
  serveStaticFile(req, res);
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend served from: ${CLIENT_BUILD_PATH}`);
  });
});
