import { Table, Column, Model, ForeignKey, PrimaryKey, IsUUID, DataType, AutoIncrement } from 'sequelize-typescript';
import Room from './room';
import User from './user';

@Table({ tableName: "Join" })
export default class Join extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @ForeignKey(() => Room)
  @Column(DataType.BIGINT)
  roomId!: number;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId!: number;
}