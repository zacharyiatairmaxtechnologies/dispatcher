import https from 'https';
import httpProxy from 'http-proxy';

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
    key: fs.readFileSync(path.join(__dirname,'_.airmaxtechnologies.com-key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'_.airmaxtechnologies.com-crt.pem')),
    ca: fs.readFileSync(path.join(__dirname,'_.airmaxtechnologies.com-chain-only.pem'))
};


https.createServer(options, (req, res) => {
    const host = req.headers.host?.split(':')[0];

    switch (host) {
        case 'whse.airmaxtechnologies.com':
            proxy.web(req, res, {
                target: 'http://localhost:8083'
            });
            break;

        case 'airmax-reports.airmaxtechnologies.com':
            proxy.web(req, res, {
                target: 'http://localhost:8080'
            });
            break;

        default:
            res.writeHead(404);
            res.end('Unknown host');
    }
}).listen(443);