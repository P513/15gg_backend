"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rating = void 0;
const express_1 = require("express");
exports.rating = (0, express_1.Router)();
exports.rating.get('/', (req, res, next) => {
    console.log('hello, rating!');
});
