import { NextFunction, Request, Response, Router, } from 'express';

export const profile = Router();

profile.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('hello, profile!');
});