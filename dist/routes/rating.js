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
exports.rating = void 0;
const index_1 = require("./../models/index");
const express_1 = require("express");
const middlewares_1 = require("./middlewares");
exports.rating = (0, express_1.Router)();
// 평균 평점 조회 API
exports.rating.get('/', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqQuery = req.query;
    const nicknameId = reqQuery.nicknameId;
    if (!nicknameId)
        return res.status(403).json((0, middlewares_1.successFalse)(null, '닉네임 ID를 입력해주세요', null));
    try {
        const nickname = yield index_1.NicknameRep.findOne({
            where: {
                id: nicknameId
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당 ID의 닉네임이 존재하지 않습니다', null));
        if (nickname.evalCnt == 0)
            return res.status(200).json((0, middlewares_1.successTrue)('해당 닉네임의 평균 평점입니다', { "evalAvg": 0 }));
        const evalAvg = nickname.evalSum / nickname.evalCnt;
        return res.status(200).json((0, middlewares_1.successTrue)(`해당 닉네임의 평균 평점입니다`, { "evalAvg": evalAvg }));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
// 평점 설정 API
/**************************************************
채팅 후에 평점을 남길 수 있는 방향으로,
채팅 여부 확인은 채팅 API 짜고 수정하도록
*************************************************/
exports.rating.post('/', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        const user = req.user;
        const reviewer = yield index_1.UserRep.findOne({
            where: {
                id: user.id
            }
        });
        if (!reviewer)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 사용자가 존재하지 않습니다', null));
        const nicknameId = reqBody.nicknameId;
        if (!nicknameId)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '평점을 남길 닉네임 ID를 입력해주세요', null));
        const rating = reqBody.rating;
        if (!rating)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '평점을 입력해주세요', null));
        const nickname = yield index_1.NicknameRep.findOne({
            where: {
                id: nicknameId
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당 닉네임이 존재하지 않습니다', null));
        if (nickname.userId === reviewer.id)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '본인 닉네임에 평점을 남길 수 없습니다', null));
        const reviewee = yield index_1.UserRep.findOne({
            where: {
                id: nickname.userId
            }
        });
        if (!reviewee)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당 닉네임의 유저가 더 이상 존재하지 않습니다', null));
        const exStar = yield index_1.StarRep.findOne({
            where: {
                userId: user.id,
                nicknameId
            }
        });
        if (exStar)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '이미 평점을 입력하였습니다', exStar));
        yield index_1.StarRep.create({
            userId: user.id,
            nicknameId
        });
        yield nickname.update({
            evalCnt: nickname.evalCnt + 1,
            evalSum: nickname.evalSum + rating
        });
        return res.status(200).json((0, middlewares_1.successTrue)(`유저의 평점이 추가되었습니다`, nickname));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
