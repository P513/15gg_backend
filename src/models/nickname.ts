import { Table, Column, Model, HasMany, ForeignKey, PrimaryKey, IsUUID, DataType, Unique, Default, AutoIncrement } from 'sequelize-typescript';
import User from './user';

@Table({ tableName: "Nickname" })
export default class Nickname extends Model<Nickname>{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Unique(true)
  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId!: number;

  @Unique(true)
  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  tier!: string;

  @Column(DataType.STRING)
  rank!: string;

  @Column(DataType.STRING)
  ment!: string;

  @Column(DataType.INTEGER)
  selfPos!: number;

  @Column(DataType.INTEGER)
  duoPos!: number;

  @Column(DataType.INTEGER)
  playStyle!: number;

  @Column(DataType.INTEGER)
  voice!: number;

  @Column(DataType.BOOLEAN)
  status!: boolean;
}