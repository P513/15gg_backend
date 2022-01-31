import { UserRep } from './../models/index';
import { NextFunction, Request, Response, Router, } from 'express';
import bcrypt from 'bcrypt';
import { isNotLoggedIn } from './middlewares';
import Nickname from '../models/nickname';
import passport from 'passport';
import User from '../models/user';
export const auth = Router();

auth.get('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send("hello, auth!");
});

auth.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('signup', async (err: any, _user: User, info: any) => {
    if (err) {
      return res.status(403).send(err);
    }
    if (info) {
      return res.status(403).send(info);
    }
    if (_user) {
      return res.status(200).send("회원가입을 완료하였습니다");
    }
  })(req, res, next);
})