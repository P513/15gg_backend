import { Table, Column, Model, HasMany, IsUUID, PrimaryKey } from 'sequelize-typescript';

@Table({ timestamps: true })
export default class Room extends Model<Room>{
    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: number;

    @Column
    createdAt:

    @Column
    deletedAt:
}