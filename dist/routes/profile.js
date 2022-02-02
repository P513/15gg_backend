"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = void 0;
const express_1 = require("express");
exports.profile = (0, express_1.Router)();
exports.profile.get('/', (req, res, next) => {
    return res.status(200).send("hello, profile!");
});
