import { NextFunction, Request, Response, Router, } from 'express';

export const rating = Router();

rating.get('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send("hello, rating!")
});