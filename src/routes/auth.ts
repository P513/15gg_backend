import { NextFunction, Request, Response, Router, } from 'express';
import { UserRep } from '../models/index';
export const auth = Router();

auth.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('hello, auth!');
});