import { NextFunction, Request, Response, Router, } from 'express';
import { isNotLoggedIn, isLoggedIn } from './middlewares';
import passport from 'passport';
import User from '../models/user';
import * as classes from '../config/classes';
import * as middlewares from './middlewares';
export const auth = Router();

auth.get('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send("hello, auth!");
});

auth.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('signup', async (err: any, _user: User, info: any) => {
    if (err) {
      return res.status(403).json(middlewares.successFalse(err, '', null));
    }
    if (info) {
      return res.status(403).json(middlewares.successFalse(null, info, null));
    }
    if (_user) {
      const user = new classes.UserInfo(_user);
      return res.status(200).json(middlewares.successTrue('회원가입을 완료하였습니다', user));
    }
  })(req, res, next);
})

auth.post('/login', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('login', (err: any, _user: User, info: any) => {
    if (err || !_user) {
      return res.status(403).json(middlewares.successFalse(err, '', null));
    }
    if (info) {
      return res.status(403).json(middlewares.successFalse(null, '아이디나 비밀번호를 확인하세요', null));
    }
    return req.login(_user, async (err: any) => {
      if (err) {
        console.log(err);
        return res.status(403).json(middlewares.successFalse(err, '로그인에 실패했습니다', null));
      }
      return res.status(200).json(middlewares.successTrue('로그인되었습니다', _user));
    })
  })(req, res, next);
})

auth.get('/logout', isLoggedIn, (req: Request, res: Response) => {
  req.logout();
  req.session.destroy(function () {
    req.session;
  });
  return res.status(200).json(middlewares.successTrue('로그아웃되었습니다', null));
})

auth.get('/kakao', passport.authenticate('kakao-login'));
auth.get('/kakao/callback', passport.authenticate('kakao-login', {
  failureRedirect: '/',
}), (req, res) => {
  return res.status(200).json(middlewares.successTrue('로그인되었습니다', null));
});

auth.get('/naver', passport.authenticate('naver-login', { authType: 'reprompt' }));
auth.get('/naver/callback', passport.authenticate('naver-login', {
  failureRedirect: '/',
}), (req, res) => {
  return res.status(200).json(middlewares.successTrue('로그인되었습니다', null));
})