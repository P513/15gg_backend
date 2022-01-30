// 로컬 로그인 절차 관리 예정
import { UserRep } from './../models/index';
import passport from 'passport';
import passportLocal from 'passport-local';
import * as crypto from 'crypto';
import { UUID } from 'sequelize/types';
import { UUIDV4 } from 'sequelize/dist';

const LocalStrategy = passportLocal.Strategy;

export function passportConfig() {
  passport.use(
    'signup',
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'pw',
      session: false,
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
          const salt = buffer.toString('base64');
          const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
          const hashedPW = key.toString('base64');
          // 나중에 이메일 인증 코드
          // const emailVeri = await emailVerify(reqBody.email);
          // if (emailVeri === 0) return done(null, false, { message: '이메일 인증이 필요합니다' });
          // const user = await UserRep.create({
          //   nicknameId: null,
          //   password: hashedPW,
          //   salt,
          //   email,
          //   googleOAuth: null,
          //   kakaoOAuth: null,
          //   evalCnt: BigInt(0),
          //   evalSum: BigInt(0),
          //   createdAt: new Date(),
          //   updatedAt: null,
          //   deletedAt: null
          // });
          // return done(null, user);
        } catch (err) {
          return done(err);
        };
      })),
  );
};
