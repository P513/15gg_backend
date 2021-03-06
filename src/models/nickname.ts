import { Table, Column, Model, HasMany, ForeignKey, PrimaryKey, IsUUID, DataType, Unique, Default, AutoIncrement, AllowNull } from 'sequelize-typescript';
import User from './user';

@Table({ tableName: "Nickname" })
export default class Nickname extends Model {
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

  @Column(DataType.INTEGER)
  tier!: number;

  @Column(DataType.INTEGER)
  rank!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  ment!: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  selfPos!: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  duoPos!: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  playStyle!: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  voice!: number;

  @Column(DataType.BOOLEAN)
  status!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  evalCnt!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  evalSum!: number;
}