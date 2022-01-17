import { Table, Column, Model, HasMany, ForeignKey, PrimaryKey, IsUUID, DataType, Unique } from 'sequelize-typescript';
import { ENUM } from 'sequelize/dist';
import User from './user';

@Table
export default class Nickname extends Model<Nickname>{
    @IsUUID(4)
    @PrimaryKey
    @Column(DataType.STRING)
    id!: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column(DataType.STRING)
    userId!: string;

    @Unique(true)
    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING)
    tier!: string;

    @Column(DataType.STRING)
    rank!: string;

    @Column(DataType.STRING)
    ment!: string;

    @Column(DataType.ARRAY(ENUM))
    selfPos!: string;

    @Column(DataType.ARRAY(ENUM))
    duoPos!: string;

    @Column(DataType.INTEGER)
    playStyle!: number;

    @Column(DataType.INTEGER)
    voice!: number;

    @Column(DataType.BOOLEAN)
    status!: boolean;
}