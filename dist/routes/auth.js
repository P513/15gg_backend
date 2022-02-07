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
const index_1 = require("./../models/index");
const express_1 = require("express");
const middlewares_1 = require("./middlewares");
const passport_1 = __importDefault(require("passport"));
const classes = __importStar(require("../config/classes"));
const index_2 = require("../models/index");
const crypto = __importStar(require("crypto"));
exports.auth = (0, express_1.Router)();
exports.auth.get('/', (req, res, next) => {
    return res.status(200).send("hello, auth!");
});
exports.auth.post('/signup', middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('signup', (err, _user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
        }
        if (info) {
            return res.status(403).json((0, middlewares_1.successFalse)(null, info, null));
        }
        if (_user) {
            const user = new classes.UserInfo(_user);
            return res.status(200).json((0, middlewares_1.successTrue)('회원가입을 완료하였습니다', user));
        }
    }))(req, res, next);
}));
exports.auth.post('/login', middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('login', (err, _user, info) => {
        if (err || !_user) {
            return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
        }
        if (info) {
            return res.status(403).json((0, middlewares_1.successFalse)(null, '아이디나 비밀번호를 확인하세요', null));
        }
        return req.login(_user, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(403).json((0, middlewares_1.successFalse)(err, '로그인에 실패했습니다', null));
            }
            req.session.userId = _user.id;
            return res.status(200).json((0, middlewares_1.successTrue)('로그인되었습니다', _user));
        }));
    })(req, res, next);
}));
exports.auth.get('/logout', middlewares_1.isLoggedIn, (req, res) => {
    if (req.session.userId) {
        req.session.destroy(function (err) {
            if (err) {
                return res.status(403).json((0, middlewares_1.successFalse)(err, '세션 삭제에 실패했습니다', null));
            }
        });
    }
    req.logout();
    return res.status(200).json((0, middlewares_1.successTrue)('로그아웃되었습니다', null));
});
exports.auth.get('/kakao', passport_1.default.authenticate('kakao-login', (req, _user) => {
    if (_user) {
        req.session.userId = _user.id;
    }
}));
exports.auth.get('/kakao/callback', passport_1.default.authenticate('kakao-login', {
    failureRedirect: '/',
}), (req, res) => {
    return res.status(200).json((0, middlewares_1.successTrue)('로그인되었습니다', null));
});
exports.auth.get('/naver', passport_1.default.authenticate('naver-login', { authType: 'reprompt' }, (req, _user) => {
    if (_user) {
        req.session.userId = _user.id;
    }
}));
exports.auth.get('/naver/callback', passport_1.default.authenticate('naver-login', {
    failureRedirect: '/',
}), (req, res) => {
    return res.status(200).json((0, middlewares_1.successTrue)('로그인되었습니다', null));
});
// 닉네임 있으면 지우는 코드 추가하기
exports.auth.delete('/signout', middlewares_1.isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const password = reqBody.password;
    try {
        const user = yield index_2.UserRep.findOne({
            where: {
                id: req.session.userId
            }
        });
        if (!user)
            return res.status(404).json((0, middlewares_1.successFalse)(null, '존재하지 않는 사용자입니다', null));
        const key = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512');
        if (user.password === key.toString('base64')) {
            if (user.nicknameId) {
                yield index_1.NicknameRep.destroy({
                    where: {
                        id: user.nicknameId,
                        userId: user.id
                    }
                });
            }
            yield user.destroy({ force: true });
            req.logout();
            req.session.destroy(function () {
                req.session;
            });
            return res.status(200).json((0, middlewares_1.successTrue)('회원 삭제가 완료되었습니다', null));
        }
        return res.status(403).json((0, middlewares_1.successFalse)(null, '비밀번호가 일치하지 않습니다', null));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
