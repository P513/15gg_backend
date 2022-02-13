"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockRep = exports.StarRep = exports.NicknameRep = exports.JoinRep = exports.ChatRep = exports.RoomRep = exports.UserRep = exports.db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("../config/config");
const user_1 = __importDefault(require("./user"));
const chat_1 = __importDefault(require("./chat"));
const join_1 = __importDefault(require("./join"));
const nickname_1 = __importDefault(require("./nickname"));
const room_1 = __importDefault(require("./room"));
const star_1 = __importDefault(require("./star"));
const block_1 = __importDefault(require("./block"));
exports.db = process.env.NODE_ENV === 'dev' ? new sequelize_typescript_1.Sequelize(config_1.config.development.database, config_1.config.development.username, config_1.config.development.password, {
    host: config_1.config.development.host,
    port: config_1.config.development.port,
    dialect: 'mysql',
}) : new sequelize_typescript_1.Sequelize(config_1.config.production.database, config_1.config.production.username, config_1.config.production.password, {
    host: config_1.config.production.host,
    port: config_1.config.production.port,
    dialect: 'mysql',
});
exports.db.addModels([user_1.default]);
exports.db.addModels([room_1.default]);
exports.db.addModels([chat_1.default]);
exports.db.addModels([join_1.default]);
exports.db.addModels([nickname_1.default]);
exports.db.addModels([star_1.default]);
exports.db.addModels([block_1.default]);
// https://github.com/RobinBuschmann/sequelize-typescript
exports.UserRep = exports.db.getRepository(user_1.default);
exports.RoomRep = exports.db.getRepository(room_1.default);
exports.ChatRep = exports.db.getRepository(chat_1.default);
exports.JoinRep = exports.db.getRepository(join_1.default);
exports.NicknameRep = exports.db.getRepository(nickname_1.default);
exports.StarRep = exports.db.getRepository(star_1.default);
exports.BlockRep = exports.db.getRepository(block_1.default);
