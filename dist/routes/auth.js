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
const crypto = __importStar(require("crypto"));
exports.auth = (0, express_1.Router)();
// 회원가입 API
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
// 로그인 API
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
            let nickname = null;
            if (_user.nicknameId) {
                const userNickname = yield index_1.NicknameRep.findOne({
                    where: {
                        id: _user.nicknameId
                    }
                });
                if (userNickname)
                    nickname = userNickname.name;
            }
            return res.status(200).json((0, middlewares_1.successTrue)('로그인되었습니다', { _user, nickname }));
        }));
    })(req, res, next);
}));
// 로그아웃 API
exports.auth.get('/logout', middlewares_1.isLoggedIn, (req, res) => {
    if (req.user) {
        req.session.destroy(function (err) {
            if (err) {
                return res.status(403).json((0, middlewares_1.successFalse)(err, '세션 삭제에 실패했습니다', null));
            }
        });
    }
    req.logout();
    return res.status(200).json((0, middlewares_1.successTrue)('로그아웃되었습니다', null));
});
// 카카오 로그인 API
// auth.get('/kakao', passport.authenticate('kakao-login', (req: Request, _user: User) => {
// }));
// auth.get('/kakao/callback', passport.authenticate('kakao-login', {
//   failureRedirect: '/',
// }), async (req, res) => {
//   const user = req.user as User;
//   let nickname = null;
//   if (user.nicknameId) {
//     const userNickname = await NicknameRep.findOne({
//       where: {
//         id: user.nicknameId
//       }
//     });
//     if (userNickname) nickname = userNickname.name;
//   }
//   return res.status(200).json(successTrue('로그인되었습니다', { user, nickname }));
// });
// 네이버 로그인 API
// auth.get('/naver', passport.authenticate('naver-login', { authType: 'reprompt' }, (req: Request, _user: User) => {
// }));
// auth.get('/naver/callback', passport.authenticate('naver-login', {
//   failureRedirect: '/',
// }), async (req, res) => {
//   const user = req.user as User; let nickname = null;
//   if (user.nicknameId) {
//     const userNickname = await NicknameRep.findOne({
//       where: {
//         id: user.nicknameId
//       }
//     });
//     if (userNickname) nickname = userNickname.name;
//   }
//   return res.status(200).json(successTrue('로그인되었습니다', { user, nickname }));
// });
// 회원탈퇴 API
exports.auth.delete('/signout', middlewares_1.isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const password = reqBody.password;
    try {
        const user = req.user;
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
// 로그인 상태 확인 API (닉네임 있으면 return)
exports.auth.get('/status', middlewares_1.isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 유저가 존재하지 않습니다', null));
    const nickname = yield index_1.NicknameRep.findOne({
        where: {
            id: user.nicknameId
        }
    });
    if (!nickname)
        return res.status(200).json((0, middlewares_1.successTrue)('로그인 중입니다', null));
    return res.status(200).json((0, middlewares_1.successTrue)('로그인 중입니다', nickname.name));
}));
