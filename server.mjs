import http from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';
dotenv.config();
var dev = process.env.NODE_ENV !== 'production';
var app = next({ dev: dev });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    http.createServer(function (req, res) {
        var _a;
        var parsedUrl = parse((_a = req.url) !== null && _a !== void 0 ? _a : '', true);
        handle(req, res, parsedUrl);
    }).listen(process.env.PORT || 3000, function () {
        console.log("> Server running on http://localhost:".concat(process.env.PORT || 3000));
    });
});
