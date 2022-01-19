import { Sequelize } from 'sequelize-typescript';
import { config } from '../config/config';
import User from './user';
import Chat from './chat';
import Join from './join';
import Nickname from './nickname';
import Room from './room';
import Star from './star';

export const db: Sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: 'mysql',
  }
);

db.addModels([User]);
db.addModels([Room]);
db.addModels([Chat]);
db.addModels([Join]);
db.addModels([Nickname]);
db.addModels([Star]);

// https://github.com/RobinBuschmann/sequelize-typescript
export const UserRep = db.getRepository(User);
export const RoomRep = db.getRepository(Room);
export const ChatRep = db.getRepository(Chat);
export const JoinRep = db.getRepository(Join);
export const NicknameRep = db.getRepository(Nickname);
export const StarRep = db.getRepository(Star);