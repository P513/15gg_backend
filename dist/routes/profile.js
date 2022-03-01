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
exports.profile = void 0;
const express_1 = require("express");
const sequelize_typescript_1 = require("sequelize-typescript");
const operators_1 = __importDefault(require("sequelize/lib/operators"));
const index_1 = require("../models/index");
const middlewares_1 = require("./middlewares");
exports.profile = (0, express_1.Router)();
// 해당 nicknameId의 정보 가져오기 API
exports.profile.get('/', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
// 매칭 가져오기(로그인 X)
exports.profile.get('/match/rand', middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchList = yield index_1.NicknameRep.findAndCountAll({
            limit: 18,
            order: sequelize_typescript_1.Sequelize.fn('RAND')
        });
        return res.status(200).json((0, middlewares_1.successTrue)('랜덤 매칭과 개수입니다', matchList));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
// 매칭 가져오기(로그인 O)
exports.profile.get('/match', middlewares_1.isLoggedIn, middlewares_1.onDuo, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user)
            return res.status(404).json((0, middlewares_1.successFalse)(null, '존재하지 않는 사용자입니다', null));
        const nicknameId = user.nicknameId;
        if (!nicknameId)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '닉네임을 먼저 등록해주세요', null));
        const nickname = yield index_1.NicknameRep.findOne({
            where: {
                id: nicknameId
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 닉네임이 존재하지 않습니다', null));
        let cnt = 18, matchList = new Array(), matchIdx = new Array();
        // 1. rank는 기본 제한 사항, 전체 일치
        const matches_all = yield index_1.NicknameRep.findAndCountAll({
            where: {
                id: { [operators_1.default.ne]: nicknameId },
                tier: { [operators_1.default.between]: [nickname.tier - 1, nickname.tier + 1] },
                selfPos: { [operators_1.default.ne]: nickname.selfPos, [operators_1.default.eq]: nickname.duoPos },
                duoPos: nickname.selfPos,
                playStyle: nickname.playStyle,
                voice: nickname.voice,
                status: true
            },
            limit: 18
        });
        if (matches_all.count === 0) { }
        else {
            for (let i = 0; i < matches_all.count; i++) {
                const match = matches_all.rows[i];
                if (cnt > 0 && matchIdx.includes(match.id) === false) {
                    matchList.push(match);
                    matchIdx.push(match.id);
                    cnt--;
                }
                else if (cnt == 0) {
                    return res.status(200).json((0, middlewares_1.successTrue)('랜덤 매칭과 개수입니다', { "count": matchList.length, "rows": matchList }));
                }
            }
        }
        ;
        // 2. position 일치
        const matches_pos = yield index_1.NicknameRep.findAndCountAll({
            where: {
                id: { [operators_1.default.ne]: nicknameId },
                tier: { [operators_1.default.between]: [nickname.tier - 1, nickname.tier + 1] },
                selfPos: { [operators_1.default.ne]: nickname.selfPos, [operators_1.default.eq]: nickname.duoPos },
                duoPos: nickname.selfPos,
                [operators_1.default.or]: [
                    { playStyle: nickname.playStyle },
                    { voice: nickname.voice }
                ],
                status: true
            },
            limit: 18
        });
        if (matches_pos.count === 0) { }
        else {
            for (let i = 0; i < matches_pos.count; i++) {
                const match = matches_pos.rows[i];
                if (cnt > 0 && matchIdx.includes(match.id) === false) {
                    matchList.push(match);
                    matchIdx.push(match.id);
                    cnt--;
                }
                else if (cnt == 0) {
                    return res.status(200).json((0, middlewares_1.successTrue)('랜덤 매칭과 개수입니다', { "count": matchList.length, "rows": matchList }));
                }
            }
        }
        ;
        // 3. 하나만이라도 일치
        const matches_tier = yield index_1.NicknameRep.findAndCountAll({
            where: {
                id: { [operators_1.default.ne]: nicknameId },
                tier: { [operators_1.default.between]: [nickname.tier - 1, nickname.tier + 1] },
                selfPos: { [operators_1.default.ne]: nickname.selfPos },
                [operators_1.default.or]: [
                    {
                        selfPos: { [operators_1.default.eq]: nickname.duoPos },
                    },
                    { duoPos: nickname.selfPos },
                    { playStyle: nickname.playStyle },
                    { voice: nickname.voice }
                ],
                status: true
            },
            limit: 18
        });
        if (matches_tier.count === 0) { }
        else {
            for (let i = 0; i < matches_tier.count; i++) {
                const match = matches_tier.rows[i];
                if (cnt > 0 && matchIdx.includes(match.id) === false) {
                    matchList.push(match);
                    matchIdx.push(match.id);
                    cnt--;
                }
                else if (cnt == 0) {
                    return res.status(200).json((0, middlewares_1.successTrue)('랜덤 매칭과 개수입니다', { "count": matchList.length, "rows": matchList }));
                }
            }
        }
        ;
        let matchArr = Array.from(matchList);
        return res.status(200).json((0, middlewares_1.successTrue)('랜덤 매칭과 개수입니다', { "count": matchList.length, "rows": matchArr }));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
