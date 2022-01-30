"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotLoggedIn = exports.isLoggedIn = void 0;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(403).send('로그인이 필요합니다');
    }
}
exports.isLoggedIn = isLoggedIn;
;
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    }
    else {
        const message = encodeURIComponent('로그인한 상태입니다');
        res.redirect(`/?error=${message}`);
    }
}
exports.isNotLoggedIn = isNotLoggedIn;
;
