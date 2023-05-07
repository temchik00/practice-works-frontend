import IUser from './IUser';

export default interface IMessage {
  content: string;
  id: number;
  chat_id: number;
  user_id: number;
  date_send: Date;
}

export interface IMessageExtended extends IMessage {
  user: IUser;
}
