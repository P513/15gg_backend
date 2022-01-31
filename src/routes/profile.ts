import { NextFunction, Request, Response, Router, } from 'express';

export const profile = Router();

profile.get('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send("hello, profile!")
});