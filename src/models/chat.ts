import { Table, Column, Model, IsUUID, PrimaryKey, DataType, ForeignKey, CreatedAt, AutoIncrement } from 'sequelize-typescript';
import Room from './room';
import User from './user';

@Table({ tableName: "Chat", timestamps: true })
export default class Chat extends Model<Chat>{
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

  @Column(DataType.STRING)
  content!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}