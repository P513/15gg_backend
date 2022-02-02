// return class 관리 파일
import User from '../models/user';

export class UserInfo {
  id!: number;

  email!: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
  }
}