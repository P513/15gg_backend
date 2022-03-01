import { NextFunction, Request, Response, Router, } from 'express';
import { UserRep, NicknameRep } from '../models/index';
import User from '../models/user';
import { hasNickname, hasNoNickname, isLoggedIn, successFalse, successTrue } from './middlewares';

export const myinfo = Router();

// 해당 유저의 nickname(info) API
myinfo.get('/', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: user.nicknameId,
        userId: user.id
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '해당 유저의 닉네임이 존재하지 않습니다', null));
    return res.status(200).json(successTrue('해당 유저의 정보입니다', nickname));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});

// 해당 유저의 nickname(info)의 설명 수정 API
myinfo.patch('/', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqBody = req.body;
    const user = req.user as User;
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: user.nicknameId,
        userId: user.id
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '해당 유저의 닉네임이 존재하지 않습니다', null));
    const ment = (reqBody.ment) ? reqBody.ment : nickname.ment;
    const selfPos = (reqBody.selfPos) ? reqBody.selfPos : nickname.selfPos;
    if (selfPos == null || selfPos < 1 || selfPos > 5) return res.status(403).json(successFalse(null, '선호 포지션을 입력해주세요', null));
    const duoPos = (reqBody.duoPos) ? reqBody.duoPos : nickname.duoPos;
    if (duoPos == null || duoPos < 1 || duoPos > 5) return res.status(403).json(successFalse(null, '듀오 희망 포지션을 입력해주세요', null));
    if (selfPos === duoPos) return res.status(403).json(successFalse(null, '선호 포지션과 듀오 희망 포지션이 일치합니다', null));
    const playStyle = (reqBody.playStyle) ? reqBody.playStyle : nickname.playStyle;
    if (playStyle == null || playStyle < 1 || playStyle > 3) return res.status(403).json(successFalse(null, '희망 플레이 스타일을 입력해주세요', null));
    const voice = (reqBody.voice) ? reqBody.voice : nickname.voice;
    if (voice == null || voice < 0 || voice > 1) return res.status(403).json(successFalse(null, '보이스 유무를 입력해주세요', null));
    const status = (reqBody.status) ? reqBody.status : nickname.status;
    if (status == null || status < 0 || status > 1) return res.status(403).json(successFalse(null, '듀오 모집 상태를 입력해주세요', null));
    nickname.update({
      ment,
      selfPos,
      duoPos,
      playStyle,
      voice,
      status,
      updatedAt: new Date()
    });
    return res.status(200).json(successTrue('해당 유저의 정보가 수정되었습니다', nickname));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
})

// nickname 존재 여부 API
myinfo.get('/nickname', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: user.nicknameId,
        userId: user.id
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '닉네임이 등록이 필요합니다', null));
    return res.status(200).json(successTrue('닉네임이 존재합니다', { "nickname": nickname.name }));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});

// 닉네임 최초 등록 API(시작 시 필수!)
myinfo.post('/nickname', isLoggedIn, hasNoNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqBody = req.body;
    const user = req.user as User;
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const name = reqBody.name as string;
    if (name == null) return res.status(403).json(successFalse(null, '닉네임 이름을 입력해주세요', null));
    const tier = reqBody.tier as number;
    if (tier == null) return res.status(403).json(successFalse(null, '티어를 입력해주세요', null));
    const rank = reqBody.rank as number;
    if (rank == null) return res.status(403).json(successFalse(null, '랭크를 입력해주세요', null));
    const status = false;
    const exNickname = await NicknameRep.findOne({
      where: {
        name
      }
    });
    if (exNickname) return res.status(403).json(successFalse(null, '이미 존재하는 닉네임입니다', null));
    const nickname = await NicknameRep.create({
      userId: user.id,
      name,
      tier,
      rank,
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

// 해당 유저의 nickname(info)의 닉네임 수정 API
myinfo.patch('/nickname', isLoggedIn, hasNickname, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqBody = req.body;
    const user = req.user as User;
    if (!user) return res.status(403).json(successFalse(null, '해당하는 사용자가 존재하지 않습니다', null));
    const name = reqBody.name as string;
    if (!name) return res.status(403).json(successFalse(null, '닉네임 이름을 입력해주세요', null));
    const tier = reqBody.tier as string;
    if (!tier) return res.status(403).json(successFalse(null, '티어를 입력해주세요', null));
    const rank = reqBody.rank as string;
    if (!rank) return res.status(403).json(successFalse(null, '랭크를 입력해주세요', null));
    const nickname = await NicknameRep.findOne({
      where: {
        id: user.nicknameId,
        userId: user.id
      }
    });
    if (!nickname) return res.status(403).json(successFalse(null, '닉네임이 존재하지 않습니다', null));
    const exNickname = await NicknameRep.findOne({
      where: {
        name
      }
    });
    if (exNickname && exNickname.userId != user.id) return res.status(403).json(successFalse(null, '이미 존재하는 닉네임입니다', null));
    nickname.update({
      name,
      tier,
      rank,
      updatedAt: new Date()
    });
    return res.status(200).json(successTrue('닉네임 설정이 완료되었습니다', nickname));
  } catch (err) {
    return res.status(403).json(successFalse(err, '', null));
  }
});