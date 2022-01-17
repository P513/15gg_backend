import { Table, Column, Model, DataType, PrimaryKey, IsUUID, CreatedAt, UpdatedAt, DeletedAt, AllowNull, Default, Unique } from 'sequelize-typescript';

@Table({ timestamps: true, paranoid: true })
export default class User extends Model<User>{
    @IsUUID(4)
    @PrimaryKey
    @Column(DataType.STRING)
    id!: string;

    @IsUUID(4)
    // 연결 전까지는 Null
    @AllowNull(true)
    @Column(DataType.STRING)
    nicknameId!: string;

    @Column(DataType.STRING)
    salt!: string;

    @Unique(true)
    @AllowNull(true)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    googleOAuth!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    kakaoOAuth!: string;

    @Default(0)
    @Column(DataType.BIGINT)
    evalCnt!: bigint;

    @Default(0)
    @Column(DataType.BIGINT)
    evalSum!: bigint;

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