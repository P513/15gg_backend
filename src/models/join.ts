import { Table, Column, Model, HasMany, ForeignKey, PrimaryKey, IsUUID } from 'sequelize-typescript';
import Room from './room';
import Nickname from './nickname';

@Table
export default class Join extends Model<Join>{
    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: number;

    @ForeignKey(() => Room)
    @Column
    roomId: 

    @ForeignKey(() => Nickname)
    @Column
    userId: 
}