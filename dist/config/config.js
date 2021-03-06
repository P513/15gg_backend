"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// DB 설정
exports.config = {
    "development": {
        "username": process.env.DEV_DB_USERNAME,
        "password": process.env.DEV_DB_PASSWORD,
        "database": process.env.DEV_DB_DBNAME,
        "host": process.env.DEV_DB_HOST,
        "port": parseInt(process.env.DEV_DB_PORT, 10),
        "dialect": "mysql",
        "timezone": '+09:00',
    },
    "production": {
        "username": process.env.PROD_DB_USERNAME,
        "password": process.env.PROD_DB_PASSWORD,
        "database": process.env.PROD_DB_DBNAME,
        "host": process.env.PROD_DB_HOST,
        "port": parseInt(process.env.PROD_DB_PORT, 10),
        "dialect": "mysql",
        "timezone": '+09:00',
        "logging": false,
    }
};
