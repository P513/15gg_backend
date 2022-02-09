import { NextFunction, Request, Response, Router, } from 'express';
import { NicknameRep } from '../models';
import { hasNickname, isLoggedIn, successFalse, successTrue } from './middlewares';

export const profile = Router();

// 해당 nicknameId의 정보 가져오기 API
profile.get('/', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  const reqQuery = req.query;
  const nicknameId = reqQuery.nicknameId;
  if (!nicknameId) return res.status(403).json(successFalse(null, '닉네임 ID를 입력해주세요', null));
  try {
    const nickname = await NicknameRep.findOne({
      where: {
        id: nicknameId
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '해당 ID의 닉네임이 존재하지 않습니다', null));
    let evalAvg;
    if (nickname.evalCnt == 0) evalAvg = 0;
    else evalAvg = nickname.evalSum / nickname.evalCnt;
    return res.status(200).json(successTrue('해당 닉네임의 정보입니다', { "nickname": nickname, "evalAvg": evalAvg }));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});