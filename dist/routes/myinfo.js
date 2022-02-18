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
exports.myinfo = void 0;
const express_1 = require("express");
const index_1 = require("../models/index");
const middlewares_1 = require("./middlewares");
exports.myinfo = (0, express_1.Router)();
// 해당 유저의 nickname(info) API
exports.myinfo.get('/', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserRep.findOne({
            where: {
                id: req.session.userId
            }
        });
        if (!user)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 사용자가 존재하지 않습니다', null));
        const nickname = yield index_1.NicknameRep.findOne({
            where: {
                id: user.nicknameId,
                userId: user.id
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당 유저의 닉네임이 존재하지 않습니다', null));
        return res.status(200).json((0, middlewares_1.successTrue)('해당 유저의 정보입니다', nickname));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
// 해당 유저의 nickname(info)의 설명 수정 API
exports.myinfo.patch('/', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        const user = yield index_1.UserRep.findOne({
            where: {
                id: req.session.userId
            }
        });
        if (!user)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 사용자가 존재하지 않습니다', null));
        const nickname = yield index_1.NicknameRep.findOne({
            where: {
                id: user.nicknameId,
                userId: user.id
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당 유저의 닉네임이 존재하지 않습니다', null));
        const ment = (reqBody.ment) ? reqBody.ment : nickname.ment;
        const selfPos = (reqBody.selfPos) ? reqBody.selfPos : nickname.selfPos;
        if (selfPos == null || selfPos < 1 || selfPos > 5)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '선호 포지션을 입력해주세요', null));
        const duoPos = (reqBody.duoPos) ? reqBody.duoPos : nickname.duoPos;
        if (duoPos == null || duoPos < 1 || duoPos > 5)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '듀오 희망 포지션을 입력해주세요', null));
        if (selfPos === duoPos)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '선호 포지션과 듀오 희망 포지션이 일치합니다', null));
        const playStyle = (reqBody.playStyle) ? reqBody.playStyle : nickname.playStyle;
        if (playStyle == null || playStyle < 1 || playStyle > 3)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '희망 플레이 스타일을 입력해주세요', null));
        const voice = (reqBody.voice) ? reqBody.voice : nickname.voice;
        if (voice == null || voice < 0 || voice > 1)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '보이스 유무를 입력해주세요', null));
        const status = (reqBody.status) ? reqBody.status : nickname.status;
        if (status == null || status < 0 || status > 1)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '듀오 모집 상태를 입력해주세요', null));
        nickname.update({
            ment,
            selfPos,
            duoPos,
            playStyle,
            voice,
            status,
            updatedAt: new Date()
        });
        return res.status(200).json((0, middlewares_1.successTrue)('해당 유저의 정보가 수정되었습니다', nickname));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
// nickname 존재 여부 API
exports.myinfo.get('/nickname', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserRep.findOne({
            where: {
                id: req.session.userId
            }
        });
        if (!user)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 사용자가 존재하지 않습니다', null));
        const nickname = yield index_1.NicknameRep.findOne({
            where: {
                id: user.nicknameId,
                userId: user.id
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '닉네임이 등록이 필요합니다', null));
        return res.status(200).json((0, middlewares_1.successTrue)('닉네임이 존재합니다', { "nickname": nickname.name }));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
// 닉네임 최초 등록 API(시작 시 필수!)
exports.myinfo.post('/nickname', middlewares_1.isLoggedIn, middlewares_1.hasNoNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        const user = yield index_1.UserRep.findOne({
            where: {
                id: req.session.userId
            }
        });
        if (!user)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 사용자가 존재하지 않습니다', null));
        const name = reqBody.name;
        if (name == null)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '닉네임 이름을 입력해주세요', null));
        const tier = reqBody.tier;
        if (tier == null)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '티어를 입력해주세요', null));
        const rank = reqBody.rank;
        if (rank == null)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '랭크를 입력해주세요', null));
        const status = false;
        const exNickname = yield index_1.NicknameRep.findOne({
            where: {
                name
            }
        });
        if (exNickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '이미 존재하는 닉네임입니다', null));
        const nickname = yield index_1.NicknameRep.create({
            userId: user.id,
            name,
            tier,
            rank,
            status,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null
        });
        user.update({
            nicknameId: nickname.id
        });
        return res.status(200).json((0, middlewares_1.successTrue)('닉네임 설정이 완료되었습니다', nickname));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
// 해당 유저의 nickname(info)의 닉네임 수정 API
exports.myinfo.patch('/nickname', middlewares_1.isLoggedIn, middlewares_1.hasNickname, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        const user = yield index_1.UserRep.findOne({
            where: {
                id: req.session.userId
            }
        });
        if (!user)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '해당하는 사용자가 존재하지 않습니다', null));
        const name = reqBody.name;
        if (!name)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '닉네임 이름을 입력해주세요', null));
        const tier = reqBody.tier;
        if (!tier)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '티어를 입력해주세요', null));
        const rank = reqBody.rank;
        if (!rank)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '랭크를 입력해주세요', null));
        const nickname = yield index_1.NicknameRep.findOne({
            where: {
                id: user.nicknameId,
                userId: user.id
            }
        });
        if (!nickname)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '닉네임이 존재하지 않습니다', null));
        const exNickname = yield index_1.NicknameRep.findOne({
            where: {
                name
            }
        });
        if (exNickname && exNickname.userId != req.session.userId)
            return res.status(403).json((0, middlewares_1.successFalse)(null, '이미 존재하는 닉네임입니다', null));
        nickname.update({
            name,
            tier,
            rank,
            updatedAt: new Date()
        });
        return res.status(200).json((0, middlewares_1.successTrue)('닉네임 설정이 완료되었습니다', nickname));
    }
    catch (err) {
        return res.status(403).json((0, middlewares_1.successFalse)(err, '', null));
    }
}));
