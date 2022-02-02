import { Request, Response, NextFunction } from "express";

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.status(403).json(successFalse(null, '로그인이 필요합니다', null));
  }
};

export function isNotLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    next();
  }
  else {
    res.status(403).json(successFalse(null, '이미 로그인된 상태입니다', null));
  }
};

export function successTrue(message: string, data: any) {
  return {
    success: true,
    message: message || null,
    data: data || null
  };
}

export function successFalse(err: any, message: string, data: any) {
  if (!err && !message) message = '데이터가 존재하지 않습니다';
  return {
    success: false,
    message,
    errors: err || null,
    data,
  };
}