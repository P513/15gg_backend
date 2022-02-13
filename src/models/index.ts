import { Sequelize } from 'sequelize-typescript';
import { config } from '../config/config';
import User from './user';
import Chat from './chat';
import Join from './join';
import Nickname from './nickname';
import Room from './room';
import Star from './star';
import Block from './block';

export const db: Sequelize = process.env.NODE_ENV === 'dev' ? new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: 'mysql',
  }
) : new Sequelize(
  config.production.database,
  config.production.username,
  config.production.password,
  {
    host: config.production.host,
    port: config.production.port,
    dialect: 'mysql',
  }
);

db.addModels([User]);
db.addModels([Room]);
db.addModels([Chat]);
db.addModels([Join]);
db.addModels([Nickname]);
db.addModels([Star]);
db.addModels([Block]);

// https://github.com/RobinBuschmann/sequelize-typescript
export const UserRep = db.getRepository(User);
export const RoomRep = db.getRepository(Room);
export const ChatRep = db.getRepository(Chat);
export const JoinRep = db.getRepository(Join);
export const NicknameRep = db.getRepository(Nickname);
export const StarRep = db.getRepository(Star);
export const BlockRep = db.getRepository(Block);