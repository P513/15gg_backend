import { Table, Column, Model, IsUUID, PrimaryKey, DataType, ForeignKey } from 'sequelize-typescript';
import Nickname from './nickname';
import User from './user';

@Table({ tableName: "Star" })
export default class Star extends Model<Star>{
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column(DataType.STRING)
  userId!: string;

  @IsUUID(4)
  @ForeignKey(() => Nickname)
  @Column(DataType.STRING)
  nicknameId!: string;
}