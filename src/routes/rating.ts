import { NextFunction, Request, Response, Router, } from 'express';

export const rating = Router();

rating.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('hello, rating!');
});