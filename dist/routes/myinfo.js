"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myinfo = void 0;
const express_1 = require("express");
exports.myinfo = (0, express_1.Router)();
exports.myinfo.get('/', (req, res, next) => {
    console.log('hello, myinfo!');
});
