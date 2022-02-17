import { match } from 'assert';
import { NextFunction, Request, Response, Router, } from 'express';
import { Sequelize } from 'sequelize-typescript';
import Op from 'sequelize/lib/operators';
import { NicknameRep, UserRep } from '../models/index';
import { hasNickname, isLoggedIn, isNotLoggedIn, successFalse, successTrue } from './middlewares';

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

// 매칭 가져오기(로그인 X)
profile.get('/match/rand', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matchList = await NicknameRep.findAndCountAll({
      limit: 18,
      order: Sequelize.fn('RAND')
    });
    return res.status(200).json(successTrue('랜덤 매칭과 개수입니다', matchList));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});

// 매칭 가져오기(로그인 O)
profile.get('/match', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;
    const user = await UserRep.findOne({
      where: {
        id: userId
      }
    });
    if (!user) return res.status(404).json(successFalse(null, '존재하지 않는 사용자입니다', null));
    const nicknameId = user.nicknameId;
    if (!nicknameId) return res.status(403).json(successFalse(null, '닉네임을 먼저 등록해주세요', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: nicknameId
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '해당하는 닉네임이 존재하지 않습니다', null));
    let cnt = 1 as number;
    let matchList = new Set();
    // rank는 기본 제한 사항, 전체 일치
    const matches_all = await NicknameRep.findAndCountAll({
      where: {
        id: { [Op.ne]: nicknameId },
        tier: { [Op.between]: [nickname.tier - 1, nickname.tier + 1] },
        selfPos: nickname.duoPos,
        duoPos: nickname.selfPos,
        playStyle: nickname.playStyle,
        voice: nickname.voice,
        status: true
      },
      limit: 18
    });
    // 18개 안 넘으면 다 넣어
    if (cnt - matches_all.count > 0) matchList.add(matches_all);
    else {
      matches_all.rows.forEach(function (match) {
        if (cnt) matchList.add(match);
        cnt--;
      });
      const matchArr = Array.from(matchList);
      return res.status(200).json(successTrue('랜덤 매칭과 개수입니다', { "count": matchList.size, "rows": matchArr }));
    };

    // position 일치
    const matches_pos = await NicknameRep.findAndCountAll({
      where: {
        id: { [Op.ne]: nicknameId },
        tier: { [Op.between]: [nickname.tier - 1, nickname.tier + 1] },
        selfPos: nickname.duoPos,
        duoPos: nickname.selfPos,
        [Op.or]: [
          { playStyle: nickname.playStyle },
          { voice: nickname.voice }
        ],
        status: true
      },
      limit: 18
    });
    if (cnt - matches_pos.count > 0) matchList.add(matches_pos);
    else {
      matches_pos.rows.forEach(function (match) {
        if (cnt) matchList.add(match);
        cnt--;
      });
      const matchArr = Array.from(matchList);
      return res.status(200).json(successTrue('랜덤 매칭과 개수입니다', { "count": matchList.size, "rows": matchArr }));
    };

    // 하나만이라도 일치
    const matches_tier = await NicknameRep.findAndCountAll({
      where: {
        id: { [Op.ne]: nicknameId },
        tier: { [Op.between]: [nickname.tier - 1, nickname.tier + 1] },
        [Op.or]: [
          { selfPos: nickname.duoPos },
          { duoPos: nickname.selfPos },
          { playStyle: nickname.playStyle },
          { voice: nickname.voice }
        ],
        status: true
      },
      limit: 18
    });
    if (cnt - matches_tier.count > 0) matchList.add(matches_tier);
    else {
      matches_tier.rows.forEach(function (match) {
        if (cnt) matchList.add(match);
        cnt--;
      });
      const matchArr = Array.from(matchList);
      return res.status(200).json(successTrue('랜덤 매칭과 개수입니다', { "count": matchList.size, "rows": matchArr }));
    };
    const matchArr = Array.from(matchList);
    return res.status(200).json(successTrue('랜덤 매칭과 개수입니다', { "count": matchList.size, "rows": matchArr }));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});