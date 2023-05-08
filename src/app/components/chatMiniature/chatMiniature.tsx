import { Link } from 'react-router-dom';
import styles from './chatMiniature.module.scss';
import { ChatMiniatureProps } from './ChatMiniatureProps';
import { useMemo } from 'react';

const ChatMiniature = ({ idx, chat }: ChatMiniatureProps) => {
  const classes = useMemo(() => {
    let cls = ['miniature'];
    if (idx % 2 === 1) cls.push('miniature-odd');
    return cls.map((str: string) => styles[str]).join(' ');
  }, [styles, idx]);
  return (
    <Link to={`/chat/${chat.id}`} className={classes}>
      {chat.name}
    </Link>
  );
};

export default ChatMiniature;
