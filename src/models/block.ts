import { Table, Column, Model, ForeignKey, PrimaryKey, DataType, AutoIncrement, CreatedAt } from 'sequelize-typescript';
import User from './user';

@Table({ tableName: "Block" })
export default class Block extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  blockUserId!: number;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  blockedUserId!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}