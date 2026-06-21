/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import dns from 'dns'

// Set default DNS resolution to ipv4first to avoid localhost DNS lookup lag
dns.setDefaultResultOrder('ipv4first');

// Load environment variables from .env.local
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key) process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error('Failed to load .env.local:', e);
}

// Helper to parse JSON body
function getBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const apiMiddlewarePlugin = () => ({
  name: 'api-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      if (url.pathname.startsWith('/api/')) {
        try {
          let handlerPath = '';
          if (url.pathname === '/api/projects') {
            handlerPath = './api/projects.js';
          } else if (url.pathname === '/api/certificates') {
            handlerPath = './api/certificates.js';
          } else if (url.pathname === '/api/admin/login') {
            handlerPath = './api/admin/login.js';
          } else if (url.pathname === '/api/contact') {
            handlerPath = './api/contact.js';
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'API Route Not Found' }));
            return;
          }

          // Import the handler dynamically, with a cache buster parameter for HMR support
          const fullHandlerPath = path.resolve(process.cwd(), handlerPath);
          const { default: handler } = await import(`file://${fullHandlerPath}?t=${Date.now()}`);

          // Parse query and body
          const query = Object.fromEntries(url.searchParams.entries());
          const body = req.method !== 'GET' && req.method !== 'HEAD' ? await getBody(req) : {};

          // Mock req/res Vercel-like helpers
          const mockedReq = Object.assign(req, { query, body });
          const mockedRes = Object.assign(res, {
            status(code) {
              res.statusCode = code;
              return mockedRes;
            },
            json(data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return mockedRes;
            },
            send(data) {
              res.end(data);
              return mockedRes;
            }
          });

          await handler(mockedReq, mockedRes);
        } catch (error) {
          console.error('Local API Execution Error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Local API server error', error: error.message }));
        }
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMiddlewarePlugin()],
  server: {
    host: true,
    allowedHosts: [
      'exemplarily-ineradicable-karole.ngrok-free.dev'
    ]
  }
})
