import { Link, Outlet } from 'react-router-dom';
import styles from './chatSelector.module.scss';

const ChatSelector = () => {
  return (
    <div className={styles['container']}>
      <div className={styles['chats']}>
        <Link to='/chat/2'>Chat 2</Link>
      </div>
      <Outlet />
    </div>
  );
};

export default ChatSelector;
