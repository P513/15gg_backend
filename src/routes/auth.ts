import { NicknameRep } from './../models/index';
import { NextFunction, Request, Response, Router, } from 'express';
import { isNotLoggedIn, isLoggedIn, successFalse, successTrue } from './middlewares';
import passport from 'passport';
import User from '../models/user';
import * as classes from '../config/classes';
import { UserRep } from '../models/index';
import * as crypto from 'crypto';
export const auth = Router();

// 회원가입 API
auth.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('signup', async (err: any, _user: User, info: any) => {
    if (err) {
      return res.status(403).json(successFalse(err, '', null));
    }
    if (info) {
      return res.status(403).json(successFalse(null, info, null));
    }
    if (_user) {
      const user = new classes.UserInfo(_user);
      return res.status(200).json(successTrue('회원가입을 완료하였습니다', user));
    }
  })(req, res, next);
});

// 로그인 API
auth.post('/login', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('login', (err: any, _user: User, info: any) => {
    if (err || !_user) {
      return res.status(403).json(successFalse(err, '', null));
    }
    if (info) {
      return res.status(403).json(successFalse(null, '아이디나 비밀번호를 확인하세요', null));
    }
    return req.login(_user, async (err: any) => {
      if (err) {
        console.log(err);
        return res.status(403).json(successFalse(err, '로그인에 실패했습니다', null));
      }
      req.session.userId = _user.id;
      let nickname = null;
      if (_user.nicknameId) {
        const userNickname = await NicknameRep.findOne({
          where: {
            id: _user.nicknameId
          }
        });
        if (userNickname) nickname = userNickname.name;
      }
      return res.status(200).json(successTrue('로그인되었습니다', { _user, nickname }));
    })
  })(req, res, next);
});

// 로그아웃 API
auth.get('/logout', isLoggedIn, (req: Request, res: Response) => {
  if (req.session.userId) {
    req.session.destroy(function (err) {
      if (err) { return res.status(403).json(successFalse(err, '세션 삭제에 실패했습니다', null)); }
    });
  }
  req.logout();
  return res.status(200).json(successTrue('로그아웃되었습니다', null));
});

// 카카오 로그인 API
auth.get('/kakao', passport.authenticate('kakao-login', (req: Request, _user: User) => {
  if (_user) {
    req.session.userId = _user.id;
  }
}));
auth.get('/kakao/callback', passport.authenticate('kakao-login', {
  failureRedirect: '/',
}), async (req, res) => {
  const user = await UserRep.findOne({
    where: {
      id: req.session.userId
    }
  });
  let nickname = await NicknameRep.findOne({
    where: {
      id: user.nicknameId
    }
  });
  if (!nickname) nickname.name = null;
  return res.status(200).json(successTrue('로그인되었습니다', nickname.name));
});

// 네이버 로그인 API
auth.get('/naver', passport.authenticate('naver-login', { authType: 'reprompt' }, (req: Request, _user: User) => {
  if (_user) {
    req.session.userId = _user.id;
  }
}));
auth.get('/naver/callback', passport.authenticate('naver-login', {
  failureRedirect: '/',
}), async (req, res) => {
  const user = await UserRep.findOne({
    where: {
      id: req.session.userId
    }
  });
  let nickname = await NicknameRep.findOne({
    where: {
      id: user.nicknameId
    }
  });
  if (!nickname) nickname.name = null;
  return res.status(200).json(successTrue('로그인되었습니다', nickname.name));
});

// 회원탈퇴 API
auth.delete('/signout', isLoggedIn, async (req: Request, res: Response) => {
  const reqBody = req.body;
  const password = reqBody.password as string;
  try {
    const user = await UserRep.findOne({
      where: {
        id: req.session.userId
      }
    });
    if (!user) return res.status(404).json(successFalse(null, '존재하지 않는 사용자입니다', null));
    const key = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512');
    if (user.password === key.toString('base64')) {
      if (user.nicknameId) {
        await NicknameRep.destroy({
          where: {
            id: user.nicknameId,
            userId: user.id
          }
        });
      }
      await user.destroy({ force: true });
      req.logout();
      req.session.destroy(function () {
        req.session;
      });
      return res.status(200).json(successTrue('회원 삭제가 완료되었습니다', null));
    }
    return res.status(403).json(successFalse(null, '비밀번호가 일치하지 않습니다', null));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});

// 로그인 상태 확인 API (닉네임 있으면 return)
auth.get('/status', isLoggedIn, async (req: Request, res: Response) => {
  const user = await UserRep.findOne({
    where: {
      id: req.session.userId
    }
  });
  if (!user) return res.status(403).json(successFalse(null, '해당하는 유저가 존재하지 않습니다', null));
  const nickname = await NicknameRep.findOne({
    where: {
      id: user.nicknameId
    }
  });
  if (!nickname) return res.status(200).json(successTrue('로그인 중입니다', null));
  return res.status(200).json(successTrue('로그인 중입니다', nickname.name));
})