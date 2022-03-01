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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDuo = exports.hasNoNickname = exports.hasNickname = exports.successFalse = exports.successTrue = exports.isNotLoggedIn = exports.isLoggedIn = void 0;
const index_1 = require("./../models/index");
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(400).json(successFalse(null, '로그인이 필요합니다', null));
    }
}
exports.isLoggedIn = isLoggedIn;
;
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    }
    else {
        res.status(400).json(successFalse(null, '이미 로그인된 상태입니다', null));
    }
}
exports.isNotLoggedIn = isNotLoggedIn;
;
function successTrue(message, data) {
    return {
        success: true,
        message: message || null,
        data: data || null
    };
}
exports.successTrue = successTrue;
function successFalse(err, message, data) {
    if (!err && !message)
        message = '데이터가 존재하지 않습니다';
    return {
        success: false,
        message,
        errors: err || null,
        data,
    };
}
exports.successFalse = successFalse;
function hasNickname(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user)
                return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
            if (!user.nicknameId)
                return res.status(403).json(successFalse(null, '닉네임 등록이 필요합니다', null));
            next();
        }
        catch (err) {
            return res.status(403).json(successFalse(err, '', null));
        }
    });
}
exports.hasNickname = hasNickname;
function hasNoNickname(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user)
                return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
            if (user.nicknameId)
                return res.status(403).json(successFalse(null, '이미 닉네임 등록이 된 아이디입니다', null));
            next();
        }
        catch (err) {
            return res.status(403).json(successFalse(err, '', null));
        }
    });
}
exports.hasNoNickname = hasNoNickname;
// 해당 아이디가 모집을 허용하는지 && 닉네임 존재하는지 확인하는 middleware
function onDuo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user)
                return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
            if (!user.nicknameId)
                return res.status(403).json(successFalse(null, '닉네임 등록이 필요합니다', null));
            const nickname = yield index_1.NicknameRep.findOne({
                where: {
                    id: user.nicknameId
                }
            });
            if (!nickname)
                return res.status(403).json(successFalse(null, '해당 닉네임이 존재하지 않습니다', null));
            if (nickname.status === false)
                return res.status(403).json(successFalse(null, '해당 유저는 듀오를 모집하지 않고 있습니다', null));
            next();
        }
        catch (err) {
            return res.status(403).json(successFalse(err, '', null));
        }
    });
}
exports.onDuo = onDuo;
