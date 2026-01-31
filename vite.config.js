import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import http from 'http';
import https from 'https';
import url from 'url';
function sseProxyPlugin() {
    return {
        name: 'sse-proxy',
        configureServer: function (server) {
            return function () {
                server.middlewares.use(function (req, res, next) {
                    var _a;
                    if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/api/sse'))) {
                        return next();
                    }
                    // Habilitar CORS
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                    if (req.method === 'OPTIONS') {
                        res.writeHead(200);
                        res.end();
                        return;
                    }
                    var queryParams = new url.URLSearchParams(url.parse(req.url, true).search);
                    var targetUrl = queryParams.get('url');
                    var authHeader = queryParams.get('auth');
                    if (!targetUrl) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing url parameter' }));
                        return;
                    }
                    try {
                        var parsedUrl = new URL(targetUrl);
                        var protocol = parsedUrl.protocol === 'https:' ? https : http;
                        var options = {
                            method: 'GET',
                            headers: {
                                'Accept': 'text/event-stream',
                                'Cache-Control': 'no-cache',
                                'Connection': 'keep-alive',
                            }
                        };
                        if (authHeader) {
                            options.headers['Authorization'] = authHeader;
                        }
                        console.log("[SSE Proxy] Conectando a: ".concat(targetUrl));
                        var proxyReq = protocol.request(parsedUrl, options, function (proxyRes) {
                            console.log("[SSE Proxy] Status: ".concat(proxyRes.statusCode));
                            if (proxyRes.statusCode === 401) {
                                res.writeHead(401, { 'Content-Type': 'text/event-stream' });
                                res.write('event: error\n');
                                res.write('data: {"error": "Unauthorized - Invalid authentication"}\n\n');
                                res.end();
                                return;
                            }
                            if (proxyRes.statusCode !== 200) {
                                res.writeHead(proxyRes.statusCode || 500, { 'Content-Type': 'text/event-stream' });
                                res.write('event: error\n');
                                res.write("data: {\"error\": \"Server returned ".concat(proxyRes.statusCode, "\"}\n\n"));
                                res.end();
                                return;
                            }
                            res.writeHead(200, {
                                'Content-Type': 'text/event-stream',
                                'Cache-Control': 'no-cache',
                                'Connection': 'keep-alive',
                                'Access-Control-Allow-Origin': '*',
                            });
                            proxyRes.on('data', function (chunk) {
                                res.write(chunk);
                            });
                            proxyRes.on('end', function () {
                                res.end();
                            });
                            proxyRes.on('error', function (err) {
                                console.error('[SSE Proxy] Response error:', err.message);
                                res.write('event: error\n');
                                res.write("data: {\"error\": \"".concat(err.message, "\"}\n\n"));
                                res.end();
                            });
                        });
                        proxyReq.on('error', function (err) {
                            console.error('[SSE Proxy] Request error:', err.message);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: err.message }));
                        });
                        proxyReq.end();
                    }
                    catch (err) {
                        console.error('[SSE Proxy] Error:', err instanceof Error ? err.message : String(err));
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid URL' }));
                    }
                });
            };
        }
    };
}
export default defineConfig(function (_a) {
    var command = _a.command, mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react(), sseProxyPlugin()],
        server: {
            port: parseInt(env.VITE_PORT || '3000', 10),
            open: true
        }
    };
});
