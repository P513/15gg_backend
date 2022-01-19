import { Table, Column, Model, ForeignKey, PrimaryKey, IsUUID, DataType } from 'sequelize-typescript';
import Room from './room';
import User from './user';

@Table({ tableName: "Join" })
export default class Join extends Model<Join>{
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
}