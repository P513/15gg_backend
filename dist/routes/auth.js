"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = require("express");
const middlewares_1 = require("./middlewares");
const passport_1 = __importDefault(require("passport"));
exports.auth = (0, express_1.Router)();
// auth.get('/', (req: Request, res: Response, next: NextFunction) => {
//   console.log('hello, auth!');
// });
exports.auth.post('/signup', middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('signup', (err, _user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).send(err);
        }
        if (info) {
            return res.status(403).send(info);
        }
        if (_user) {
            return res.status(200).send("회원가입을 완료하였습니다");
        }
    }))(req, res, next);
}));
