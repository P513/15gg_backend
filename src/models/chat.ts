import { Table, Column, Model, HasMany, IsUUID, PrimaryKey } from 'sequelize-typescript';

@Table({ timestamps: true })
export default class Chat extends Model<Chat>{
    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: number;

    @Column
    userId: 

    @Column
    roomId: 

    @Column
    content:

    @Column
    createdAt:
}