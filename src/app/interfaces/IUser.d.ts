export interface IUserBase {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
}

export interface IUserResponse extends IUserBase {
  date_created: string;
}

export default interface IUser extends IUserBase {
  date_created: Date;
}
