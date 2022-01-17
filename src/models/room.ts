import { Table, Column, Model, IsUUID, PrimaryKey, DataType, CreatedAt } from 'sequelize-typescript';

@Table({ timestamps: true })
export default class Room extends Model<Room>{
    @IsUUID(4)
    @PrimaryKey
    @Column(DataType.STRING)
    id!: string;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;
}