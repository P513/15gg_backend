"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successFalse = exports.successTrue = exports.isNotLoggedIn = exports.isLoggedIn = void 0;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(403).json(successFalse(null, '로그인이 필요합니다', null));
    }
}
exports.isLoggedIn = isLoggedIn;
;
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    }
    else {
        res.status(403).json(successFalse(null, '이미 로그인된 상태입니다', null));
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
