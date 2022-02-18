import { UserRep, NicknameRep } from './../models/index';
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

export async function hasNickname(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserRep.findOne({
      where: { id: req.session.userId }
    });
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    if (!user.nicknameId) return res.status(403).json(successFalse(null, '닉네임 등록이 필요합니다', null));
    next();
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
}

export async function hasNoNickname(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserRep.findOne({
      where: { id: req.session.userId }
    });
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    if (user.nicknameId) return res.status(403).json(successFalse(null, '이미 닉네임 등록이 된 아이디입니다', null));
    next();
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
}

// 해당 아이디가 모집을 허용하는지 && 닉네임 존재하는지 확인하는 middleware
export async function onDuo(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserRep.findOne({
      where: { id: req.session.userId }
    });
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    if (!user.nicknameId) return res.status(403).json(successFalse(null, '닉네임 등록이 필요합니다', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: user.nicknameId
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '해당 닉네임이 존재하지 않습니다', null));
    if (nickname.status === false) return res.status(403).json(successFalse(null, '해당 유저는 듀오를 모집하지 않고 있습니다', null));
    next();
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
}