const url = require('url');

class Router {
    constructor() {
        this.routes = [];
    }

    _addRoute(method, path, ...handlers) {
        // Convert /api/expenses/:id to a regex with named groups
        const paramNames = [];
        const regexPath = path.replace(/:([^/]+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });
        const regex = new RegExp(`^${regexPath}$`);
        this.routes.push({ method, regex, paramNames, handlers });
    }

    get(path, ...handlers) { this._addRoute('GET', path, ...handlers); }
    post(path, ...handlers) { this._addRoute('POST', path, ...handlers); }
    put(path, ...handlers) { this._addRoute('PUT', path, ...handlers); }
    delete(path, ...handlers) { this._addRoute('DELETE', path, ...handlers); }

    async handleRequest(req, res) {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Parse URL
        const parsedUrl = url.parse(req.url, true);
        req.path = parsedUrl.pathname;
        req.query = parsedUrl.query;

        // Parse JSON body for POST/PUT
        if (req.method === 'POST' || req.method === 'PUT') {
            try {
                req.body = await this._parseBody(req);
            } catch (err) {
                return this._sendJson(res, 400, { message: 'Invalid JSON body' });
            }
        }

        // Helper to send JSON responses
        res.json = (statusCode, data) => this._sendJson(res, statusCode, data);

        // Find matching route
        for (const route of this.routes) {
            if (route.method !== req.method) continue;
            const match = req.path.match(route.regex);
            if (match) {
                // Extract params
                req.params = {};
                route.paramNames.forEach((name, i) => {
                    req.params[name] = match[i + 1];
                });

                // Execute handlers (middleware chain)
                try {
                    for (const handler of route.handlers) {
                        const result = await handler(req, res);
                        if (res.writableEnded) return; // Response already sent
                    }
                } catch (err) {
                    console.error('Route handler error:', err);
                    if (!res.writableEnded) {
                        this._sendJson(res, 500, { message: err.message || 'Internal Server Error' });
                    }
                }
                return;
            }
        }

        // No route found
        this._sendJson(res, 404, { message: 'Route not found' });
    }

    _parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                if (!body) return resolve({});
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
            req.on('error', reject);
        });
    }

    _sendJson(res, statusCode, data) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
}

module.exports = Router;
