import { NextFunction, Request, Response, Router, } from 'express';

export const myinfo = Router();

myinfo.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('hello, myinfo!');
});