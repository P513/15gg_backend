"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = require("express");
exports.auth = (0, express_1.Router)();
exports.auth.get('/', (req, res, next) => {
    console.log('hello, auth!');
});
