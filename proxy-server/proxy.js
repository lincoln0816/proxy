const httpProxy = require('http-proxy');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

app.use(compression()); // Enable GZIP compression for speed
app.use(cookieParser()); // Parse cookies for login functionality

// Proxy server middleware to handle all requests
app.use((req, res) => {
    const targetUrl = req.url.substring(1); // The requested site URL (without leading slash)

    console.log(`Proxying request to: ${targetUrl}`);
    
    // Handle error scenario if proxy fails
    proxy.web(req, res, { target: targetUrl }, (err) => {
        if (err) {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        }
    });
});

// Forward necessary cookies and headers for session management and login
proxy.on('proxyReq', (proxyReq, req, res) => {
    // Forward authentication if present
    if (req.headers['authorization']) {
        proxyReq.setHeader('authorization', req.headers['authorization']);
    }
    // Forward cookies
    proxyReq.setHeader('cookie', req.headers['cookie'] || '');
    // Forward user-agent
    proxyReq.setHeader('user-agent', req.headers['user-agent']);
});

// Handle proxy response and pass cookies back
proxy.on('proxyRes', (proxyRes, req, res) => {
    const setCookieHeaders = proxyRes.headers['set-cookie'];
    if (setCookieHeaders) {
        // Re-set cookies for the client side
        res.setHeader('set-cookie', setCookieHeaders);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
