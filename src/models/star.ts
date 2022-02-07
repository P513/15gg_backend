import { Table, Column, Model, IsUUID, PrimaryKey, DataType, ForeignKey, Default, AutoIncrement } from 'sequelize-typescript';
import Nickname from './nickname';
import User from './user';

@Table({ tableName: "Star" })
export default class Star extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId!: number;

  @ForeignKey(() => Nickname)
  @Column(DataType.BIGINT)
  nicknameId!: number;
}