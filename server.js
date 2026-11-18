const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = parseInt(process.env.PORT || '5000', 10);
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const STORE_DATA_FILE = path.join(PUBLIC_DIR, 'store-data.json');
const INDEX_HTML_FILE = path.join(PUBLIC_DIR, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8'
};

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 25 * 1024 * 1024) { // 25MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Bad Request' }));
  }

  const pathname = decodeURIComponent(parsedUrl.pathname);

  // API ROUTE: GET /api/data
  if (req.method === 'GET' && pathname === '/api/data') {
    try {
      if (fs.existsSync(STORE_DATA_FILE)) {
        const data = fs.readFileSync(STORE_DATA_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'store-data.json not found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // API ROUTE: POST /api/save
  if (req.method === 'POST' && pathname === '/api/save') {
    try {
      const rawBody = await readRequestBody(req);
      const newConfig = JSON.parse(rawBody);

      // 1. Write store-data.json
      fs.writeFileSync(STORE_DATA_FILE, JSON.stringify(newConfig, null, 2), 'utf8');

      // 2. Also update <script id="catalogData"> in index.html
      if (fs.existsSync(INDEX_HTML_FILE)) {
        let indexHtml = fs.readFileSync(INDEX_HTML_FILE, 'utf8');
        const minifiedJson = JSON.stringify(newConfig);
        const regex = /<script id="catalogData" type="application\/json">[\s\S]*?<\/script>/;
        const replacement = `<script id="catalogData" type="application/json">${minifiedJson}</script>`;

        if (regex.test(indexHtml)) {
          indexHtml = indexHtml.replace(regex, replacement);
          fs.writeFileSync(INDEX_HTML_FILE, indexHtml, 'utf8');
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: true,
        message: 'All changes saved to index.html and store-data.json successfully!',
        productsCount: newConfig.products ? newConfig.products.length : 0
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // API ROUTE: POST /api/deploy
  if (req.method === 'POST' && pathname === '/api/deploy') {
    console.log('[Deploy] Starting Firebase deployment from admin console...');
    exec('npx firebase-tools deploy --only hosting --project al-noor-enterprises', { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error('[Deploy Error]:', stderr || error.message);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          success: false,
          error: stderr || error.message,
          output: stdout
        }));
      }

      console.log('[Deploy Success]:', stdout);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: true,
        message: 'Successfully deployed to Firebase Hosting!',
        output: stdout,
        hostingUrl: 'https://al-noor-enterprises.web.app'
      }));
    });
    return;
  }

  // STATIC FILE SERVING
  let sanitizedPath = pathname;
  if (sanitizedPath === '/' || sanitizedPath === '') {
    sanitizedPath = '/index.html';
  }

  const resolvedPath = path.resolve(PUBLIC_DIR, '.' + sanitizedPath);
  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>404 Not Found</h1><p>The requested file does not exist.</p>');
      }
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('500 Internal Server Error');
    }

    let filePathToServe = resolvedPath;
    if (stats.isDirectory()) {
      filePathToServe = path.join(resolvedPath, 'index.html');
    }

    const ext = path.extname(filePathToServe).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const stream = fs.createReadStream(filePathToServe);
    stream.on('open', () => {
      res.writeHead(200, { 'Content-Type': contentType });
      stream.pipe(res);
    });
    stream.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error streaming file');
    });
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Al Noor Enterprises Store & Admin Console Active`);
  console.log(` Storefront:       http://localhost:${PORT}`);
  console.log(` Admin Dashboard:  http://localhost:${PORT}/admin.html`);
  console.log(` Alternative URL:  http://127.0.0.1:${PORT}/admin.html`);
  console.log(`==================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = 8080;
    server.listen(fallbackPort, () => {
      console.log(`Port ${PORT} busy, running on fallback port ${fallbackPort}`);
      console.log(` Admin Dashboard: http://localhost:${fallbackPort}/admin.html`);
    });
  } else {
    console.error('Server error:', err);
  }
});
