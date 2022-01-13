import { NextFunction, Request, Response, Router, } from 'express';

export const auth = Router();

auth.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('hello, auth!');
});