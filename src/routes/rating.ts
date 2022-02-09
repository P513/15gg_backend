import { StarRep, UserRep, NicknameRep } from './../models/index';
import { NextFunction, Request, Response, Router, } from 'express';
import { hasNickname, isLoggedIn, successFalse, successTrue } from './middlewares';

export const rating = Router();

// 평균 평점 조회 API
rating.get('/', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
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
    if (nickname.evalCnt == 0) return res.status(200).json(successTrue('해당 닉네임의 평균 평점입니다', { "evalAvg": 0 }));
    const evalAvg = nickname.evalSum / nickname.evalCnt;
    return res.status(200).json(successTrue(`해당 닉네임의 평균 평점입니다`, { "evalAvg": evalAvg }));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});

// 평점 설정 API
/**************************************************
채팅 후에 평점을 남길 수 있는 방향으로,
채팅 여부 확인은 채팅 API 짜고 수정하도록
*************************************************/
rating.post('/', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqBody = req.body;
    const reviewer = await UserRep.findOne({
      where: {
        id: req.session.userId
      }
    });
    if (!reviewer) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const nicknameId = reqBody.nicknameId;
    if (!nicknameId) return res.status(403).json(successFalse(null, '평점을 남길 닉네임 ID를 입력해주세요', null));
    const rating = reqBody.rating as number;
    if (!rating) return res.status(403).json(successFalse(null, '평점을 입력해주세요', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: nicknameId
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '해당 닉네임이 존재하지 않습니다', null));
    if (nickname.userId === reviewer.id) return res.status(403).json(successFalse(null, '본인 닉네임에 평점을 남길 수 없습니다', null));
    const reviewee = await UserRep.findOne({
      where: {
        id: nickname.userId
      }
    });
    if (!reviewee) return res.status(403).json(successFalse(null, '해당 닉네임의 유저가 더 이상 존재하지 않습니다', null));
    const exStar = await StarRep.findOne({
      where: {
        userId: req.session.userId,
        nicknameId
      }
    });
    if (exStar) return res.status(403).json(successFalse(null, '이미 평점을 입력하였습니다', exStar));
    await StarRep.create({
      userId: req.session.userId,
      nicknameId
    });
    await nickname.update({
      evalCnt: nickname.evalCnt + 1,
      evalSum: nickname.evalSum + rating
    });
    return res.status(200).json(successTrue(`유저의 평점이 추가되었습니다`, nickname));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});