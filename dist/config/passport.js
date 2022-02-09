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
exports.passportConfig = void 0;
// 로컬 로그인 절차 관리 예정
const index_1 = require("./../models/index");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const crypto = __importStar(require("crypto"));
const dotenv = __importStar(require("dotenv"));
const passport_kakao_1 = require("passport-kakao");
const passport_naver_v2_1 = require("passport-naver-v2");
dotenv.config();
const LocalStrategy = passport_local_1.default.Strategy;
function passportConfig() {
    passport_1.default.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        // session: false,
        passReqToCallback: true,
    }, ((req, email, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBody = req.body;
            const exUser = yield index_1.UserRep.findOne({
                where: {
                    email,
                },
            });
            if (exUser)
                return done(null, false, { message: '이미 존재하는 이메일입니다' });
            const passwordVeri = reqBody.passwordVeri;
            if (password !== passwordVeri)
                return done(null, false, { message: '비밀번호가 일치하지 않습니다' });
            const buffer = crypto.randomBytes(64);
            const salt = buffer.toString('base64');
            const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
            const hashedPW = key.toString('base64');
            // 나중에 이메일 인증 코드
            // const emailVeri = await emailVerify(reqBody.email);
            // if (emailVeri === 0) return done(null, false, { message: '이메일 인증이 필요합니다' });
            const user = yield index_1.UserRep.create({
                nicknameId: null,
                password: hashedPW,
                salt,
                email,
                naverOAuth: null,
                kakaoOAuth: null,
                evalCnt: 0,
                evalSum: 0,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null
            });
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
        ;
    }))));
    passport_1.default.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        // session: false,
        passReqToCallback: true,
    }, ((req, email, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield index_1.UserRep.findOne({
                where: {
                    email
                }
            });
            if (!user)
                return done(null, false, { message: '해당하는 이메일의 사용자가 없습니다' });
            const key = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512');
            if (user.password === key.toString('base64'))
                return done(null, user);
            return done(null, false, { message: '비밀번호가 일치하지 않습니다' });
        }
        catch (err) {
            return done(err);
        }
    }))));
    passport_1.default.use('kakao-login', new passport_kakao_1.Strategy({
        clientID: process.env.KAKAO_ID,
        clientSecret: "",
        callbackURL: "/auth/kakao/callback",
    }, ((accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const exUser = yield index_1.UserRep.findOne({
                where: { kakaoOAuth: profile.id },
            });
            if (exUser) {
                done(null, exUser);
            }
            else {
                const newUser = yield index_1.UserRep.create({
                    email: profile._json.kakao_account.email,
                    nicknameId: null,
                    naverOAuth: null,
                    kakaoOAuth: profile.id,
                    createdAt: new Date(),
                    updatedAt: null,
                    deletedAt: null
                });
                done(null, newUser);
            }
        }
        catch (err) {
            done(err);
        }
    }))));
    passport_1.default.use('naver-login', new passport_naver_v2_1.Strategy({
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: "/auth/naver/callback"
    }, ((accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const exUser = yield index_1.UserRep.findOne({
                where: { naverOAuth: profile.id },
            });
            if (exUser) {
                done(null, exUser);
            }
            else {
                const newUser = yield index_1.UserRep.create({
                    email: profile.email,
                    nicknameId: null,
                    naverOAuth: profile.id,
                    kakaoOAuth: null,
                    createdAt: new Date(),
                    updatedAt: null,
                    deletedAt: null
                });
                done(null, newUser);
            }
        }
        catch (err) {
            done(err);
        }
    }))));
}
exports.passportConfig = passportConfig;
;
