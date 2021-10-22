const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const os = require('os');

let ipaddress = '127.0.0.1';

const server = http.createServer(async (req, res) => {
    res.end(fs.readFileSync(path.join(__dirname, 'index.html')).toString().replace(/IP_ADDRESS/, ipaddress));
});

server.on('upgrade', (req, socket) => {
    const hash = crypto.createHash('sha1');
    hash.update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    const responseNonce = hash.digest('base64');

    const responseHeaders = [
        `HTTP/1.1 101 Switching Protocols`,
        `Upgrade: websocket`,
        `Connection: Upgrade`,
        `Sec-WebSocket-Accept: ${responseNonce}`,
        `Sec-WebSocket-Extensions: permessage-deflate`
    ];

    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

    let totalDataSize = 0;
    socket.on('data', (data) => {
        totalDataSize += data.length;
        console.log(`received ${data.length} bytes!`);
    });
    socket.on('end', () => {
        console.log(`received ${totalDataSize} bytes in total!`);
    });
});

server.listen(8080, '0.0.0.0', () => {
    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (!iface.internal && iface.family === 'IPv4' && ipaddress === '127.0.0.1') {
                ipaddress = iface.address;
            }
        });
    });
    console.log(`Open http://${ipaddress}:8080`);
});

