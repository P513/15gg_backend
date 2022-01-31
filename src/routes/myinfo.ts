import { NextFunction, Request, Response, Router, } from 'express';
import { UserRep } from '../models/index';

export const myinfo = Router();

myinfo.get('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send("hello, myinfo!")
});