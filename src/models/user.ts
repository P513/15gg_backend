import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, IsUUID } from 'sequelize-typescript';

@Table({ timestamps: true })
export default class User extends Model<User>{
    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: number;

    @Column
    nickNameId: 

    @Column
    salt: 

    @Column
    email:

    @Column
    googleOAuth:

    @Column
    kakaoOAuth:

    @Column
    authToken:

    @Column
    evalCnt:    
    
    @Column
    evalSum:

    @Column
    createdAt:

    @Column
    updatedAt:

    @Column
    deletedAt:
}