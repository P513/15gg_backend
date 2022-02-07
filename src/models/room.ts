import { Table, Column, Model, IsUUID, PrimaryKey, DataType, CreatedAt, Default, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: "Room", timestamps: true })
export default class Room extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}