import { Table, Column, Model, IsUUID, PrimaryKey, DataType, ForeignKey, CreatedAt } from 'sequelize-typescript';
import Room from './room';
import User from './user';

@Table({ tableName: "Chat", timestamps: true })
export default class Chat extends Model<Chat>{
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @IsUUID(4)
  @ForeignKey(() => Room)
  @Column(DataType.STRING)
  roomId!: string;

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column(DataType.STRING)
  userId!: string;

  @Column(DataType.STRING)
  content!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}