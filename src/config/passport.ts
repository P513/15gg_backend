// 로컬 로그인 절차 관리 예정
import { UserRep } from './../models/index';
import passport from 'passport';
import passportLocal from 'passport-local';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { Strategy as KakaoStrategy, Profile as kakaoProfile } from 'passport-kakao';
import { Strategy as NaverStrategy, Profile as naverProfile } from 'passport-naver-v2';
dotenv.config();

const LocalStrategy = passportLocal.Strategy;

export function passportConfig() {
  passport.use(
    'signup',
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      // session: false,
      passReqToCallback: true,
    },
      (async (req, email, password, done) => {
        try {
          const reqBody = req.body;
          const exUser = await UserRep.findOne({
            where: {
              email,
            },
          });
          if (exUser) return done(null, false, { message: '이미 존재하는 이메일입니다' });
          const passwordVeri = reqBody.passwordVeri;
          if (password !== passwordVeri) return done(null, false, { message: '비밀번호가 일치하지 않습니다' });
          const buffer = crypto.randomBytes(64);
          const salt: string = buffer.toString('base64');
          const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
          const hashedPW: string = key.toString('base64');
          // 나중에 이메일 인증 코드
          // const emailVeri = await emailVerify(reqBody.email);
          // if (emailVeri === 0) return done(null, false, { message: '이메일 인증이 필요합니다' });
          const user = await UserRep.create({
            nicknameId: null,
            password: hashedPW,
            salt,
            email,
            naverOAuth: null,
            kakaoOAuth: null,
            evalCnt: BigInt(0),
            evalSum: BigInt(0),
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null
          });
          return done(null, user);
        } catch (err) {
          return done(err);
        };
      })),
  );

  passport.use(
    'login',
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      // session: false,
      passReqToCallback: true,
    },
      (async (req, email, password, done) => {
        try {
          const user = await UserRep.findOne({
            where: {
              email
            }
          });
          if (!user) return done(null, false, { message: '해당하는 이메일의 사용자가 없습니다' });
          const key = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512');
          if (user.password === key.toString('base64')) return done(null, user);
          return done(null, false, { message: '비밀번호가 일치하지 않습니다' });
        } catch (err) {
          return done(err);
        }
      })
    ));

  passport.use(
    'kakao-login',
    new KakaoStrategy({
      clientID: process.env.KAKAO_ID,
      clientSecret: "",
      callbackURL: "/auth/kakao/callback",
    }, (async (accessToken: string, refreshToken: string, profile: kakaoProfile, done: any) => {
      try {
        const exUser = await UserRep.findOne({
          where: { kakaoOAuth: profile.id },
        });
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await UserRep.create({
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
      } catch (err) {
        done(err);
      }
    }))
  );

  passport.use(
    'naver-login',
    new NaverStrategy({
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: "/auth/naver/callback"
    }, (async (accessToken: string, refreshToken: string, profile: naverProfile, done: any) => {
      try {
        const exUser = await UserRep.findOne({
          where: { naverOAuth: profile.id },
        });
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await UserRep.create({
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
      } catch (err) {
        done(err);
      }
    })))
};
