import { Table, Column, Model, HasMany, ForeignKey, PrimaryKey, IsUUID } from 'sequelize-typescript';
import User from './user';

@Table
export default class Nickname extends Model<Nickname>{
    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: number;

    @ForeignKey(() => User)
    @Column
    userId: 

    @Column
    name: 

    @Column
    tier:

    @Column
    rank:

    @Column
    ment:

    @Column
    selfPos:    
    
    @Column
    duoPos:

    @Column
    playStyle:

    @Column
    voice:

    @Column
    status:
}