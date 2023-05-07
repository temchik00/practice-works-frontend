import { IMessageExtended } from 'src/app/interfaces/IMessage';
import styles from './chatMessage.module.scss';
import { Link } from 'react-router-dom';

const ChatMessage = ({
  message,
  fromSelf,
}: {
  message: IMessageExtended;
  fromSelf: boolean;
}) => {
  return (
    <div
      className={`${styles['container']}${
        fromSelf ? ' ' + styles['container-self'] : ''
      }`}
    >
      <div className={styles['info']}>
        <Link
          className={styles['info-user']}
          to={`/profile/${message.user_id}`}
        >
          {message.user.username}
        </Link>
        <div className={styles['info-datetime']}>
          {message.date_send.toDateString() == new Date().toDateString()
            ? message.date_send.toLocaleTimeString()
            : message.date_send.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
        </div>
      </div>
      <div className={styles['content']}>{message.content}</div>
    </div>
  );
};

export default ChatMessage;
