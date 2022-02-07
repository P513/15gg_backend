import { NextFunction, Request, Response, Router, } from 'express';
import { UserRep, NicknameRep } from '../models/index';
import { hasNickname, hasNoNickname, isLoggedIn, successFalse, successTrue } from './middlewares';

export const myinfo = Router();

// nickname 존재 여부 API
myinfo.get('/nickname', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserRep.findOne({
      where: {
        id: req.session.userId
      }
    });
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: user.nicknameId,
        userId: user.id
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '닉네임이 등록이 필요합니다', null));
    return res.status(200).json(successTrue('닉네임이 존재합니다', nickname.name));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});

// 닉네임 최초 등록 API
myinfo.post('/nickname', isLoggedIn, hasNoNickname, async (req: Request, res: Response, next: NextFunction) => {
  const reqBody = req.body;
  try {
    const user = await UserRep.findOne({
      where: {
        id: req.session.userId
      }
    });
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const name = reqBody.name as string;
    if (!name) return res.status(403).json(successFalse(null, '닉네임 이름을 입력해주세요', null));
    const tier = reqBody.tier as string;
    if (!tier) return res.status(403).json(successFalse(null, '티어를 입력해주세요', null));
    const rank = reqBody.rank as string;
    if (!rank) return res.status(403).json(successFalse(null, '랭크를 입력해주세요', null));
    const ment = reqBody.ment as string;
    const selfPos = reqBody.selfPos as number;
    if (!selfPos) return res.status(403).json(successFalse(null, '선호 포지션을 입력해주세요', null));
    const duoPos = reqBody.duoPos as number;
    if (!duoPos) return res.status(403).json(successFalse(null, '듀오 희망 포지션을 입력해주세요', null));
    const playStyle = reqBody.playStyle as number;
    if (!playStyle) return res.status(403).json(successFalse(null, '희망 플레이 스타일을 입력해주세요', null));
    const voice = reqBody.voice as number;
    if (!voice) return res.status(403).json(successFalse(null, '보이스 유무를 입력해주세요', null));
    const status = reqBody.voice as boolean;
    if (!status) return res.status(403).json(successFalse(null, '듀오 모집 상태를 입력해주세요', null));
    const nickname = await NicknameRep.create({
      userId: user.id,
      name,
      tier,
      rank,
      ment,
      selfPos,
      duoPos,
      playStyle,
      voice,
      status,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    });
    user.update({
      nicknameId: nickname.id
    });
    return res.status(200).json(successTrue('닉네임 설정이 완료되었습니다', nickname));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});