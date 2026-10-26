import http from 'http';

import https from 'https';
import httpProxy from 'http-proxy';

import fs from 'fs';

import path from 'path';

http.createServer((req, res) => {
    res.writeHead(301, {
        Location: `https://${req.headers.host}${req.url}`
    });
    res.end();
}).listen(80);

const proxy = httpProxy.createProxyServer();

proxy.on('error', (err, req, res) => {
    console.error(err);

    if (!res.headersSent) {
        res.writeHead(502);
    }

    res.end('Bad Gateway');
});
const __dirname = 'c:/SSL Certs/pem';

const options = {
    key: fs.readFileSync(path.join(__dirname, '_.airmaxtechnologies.com-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '_.airmaxtechnologies.com-crt.pem')),
    ca: fs.readFileSync(path.join(__dirname, '_.airmaxtechnologies.com-chain-only.pem'))
};


https.createServer(options, (req, res) => {
    const host = req.headers.host?.split(':')[0];

    switch (host) {
        case 'whse.airmaxtechnologies.com':
            proxy.web(req, res, {
                target: 'https://localhost:8083',
                secure: false,
                changeOrigin: false
            });
            break;

        case 'airmax-reports.airmaxtechnologies.com':
            proxy.web(req, res, {
                target: 'http://localhost:8082'
            });
            break;

        default:
            res.writeHead(404);
            res.end('Unknown host');
    }
}).listen(443);


const server = https.createServer(options, (req, res) => {
    // your existing switch
});

server.on('upgrade', (req, socket, head) => {
    const host = req.headers.host?.split(':')[0];

    switch (host) {
        case 'whse.airmaxtechnologies.com':
            proxy.ws(req, socket, head, {
                target: 'https://localhost:8083',
                secure: false,
                changeOrigin: false
            });
            break;

        case 'airmax-reports.airmaxtechnologies.com':
            proxy.ws(req, socket, head, {
                target: 'http://localhost:8082'
            });
            break;

        default:
            socket.destroy();
    }
});

server.listen(443);