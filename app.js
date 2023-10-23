const http = require('http');
require('dotenv').config();
const serveStatic = require('serve-static');
const path = require('path');
const fs = require('fs');
// const qs = require('querystring');

const convertMp3 = require('./ConvertMp3Controller');

// Serve up public
var serve = serveStatic('public');

// Send interval in millis
// const sendInterval = 2000;

// function sendServerSendEvent(req, res) {
//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         Connection: 'keep-alive',
//     });

//     const sseId = new Date().toLocaleTimeString();

//     setInterval(function () {
//         writeServerSendEvent(res, sseId, new Date().toLocaleTimeString());
//     }, sendInterval);

//     writeServerSendEvent(res, sseId, new Date().toLocaleTimeString());
// }

// function writeServerSendEvent(res, sseId, data) {
//     res.write('id: ' + sseId + '\n');
//     res.write('data: new server event ' + data + '\n\n');
// }

function routes(req, res) {
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        if (req._parsedUrl.pathname == '/convert-mp3' && req._parsedUrl.query) {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });
            convertMp3(req, res);
        }
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.write(fs.readFileSync(__dirname + '/index.html'));
        res.end();
    }
}

// Create server
http.createServer(function (req, res) {
    serve(req, res, () => routes(req, res));
}).listen(8080, () => {
    console.log(`Server is running on port:8080`);
});
