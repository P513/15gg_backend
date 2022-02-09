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
exports.profile = void 0;
const express_1 = require("express");
const models_1 = require("../models");
const middlewares_1 = require("./middlewares");
exports.profile = (0, express_1.Router)();
// 해당 nicknameId의 정보 가져오기 API
exports.profile.get('/', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqQuery = req.query;
    const nicknameId = reqQuery.nicknameId;
    if (!nicknameId)
        return res.status(403).json((0, middlewares_1.successFalse)(null, '닉네임 ID를 입력해주세요', null));
    try {
        const nickname = yield models_1.NicknameRep.findOne({
            where: {
                id: nicknameId
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당 ID의 닉네임이 존재하지 않습니다', null));
        let evalAvg;
        if (nickname.evalCnt == 0)
            evalAvg = 0;
        else
            evalAvg = nickname.evalSum / nickname.evalCnt;
        return res.status(200).json((0, middlewares_1.successTrue)('해당 닉네임의 정보입니다', { "nickname": nickname, "evalAvg": evalAvg }));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
