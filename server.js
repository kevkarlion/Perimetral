"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var url_1 = require("url");
var next_1 = require("next");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var dev = process.env.NODE_ENV !== 'production';
var app = (0, next_1.default)({ dev: dev });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    http_1.default.createServer(function (req, res) {
        var _a;
        var parsedUrl = (0, url_1.parse)((_a = req.url) !== null && _a !== void 0 ? _a : '', true);
        handle(req, res, parsedUrl);
    }).listen(process.env.PORT || 3000, function () {
        console.log("> Server running on http://localhost:".concat(process.env.PORT || 3000));
    });
});
