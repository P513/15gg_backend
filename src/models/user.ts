import { Table, Column, Model, DataType, PrimaryKey, IsUUID, CreatedAt, UpdatedAt, DeletedAt, AllowNull, Default, Unique, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: "User", timestamps: true, paranoid: true })
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  // 연결 전까지는 Null
  @Unique(true)
  @AllowNull(true)
  @Column(DataType.BIGINT)
  nicknameId!: number;

  // hashing된 비밀번호
  @Column(DataType.STRING)
  password!: string;

  @Column(DataType.STRING)
  salt!: string;

  @Unique(true)
  @AllowNull(true)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  naverOAuth!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  kakaoOAuth!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt!: Date;
}