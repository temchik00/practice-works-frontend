import { useMemo } from 'react';
import styles from './chat.module.scss';
import { useChat } from './useChat';
import { IMessageExtended } from 'src/app/interfaces/IMessage';
import ChatMessage from 'src/app/components/chatMessage/chatMessage';

export default function Chat() {
  const {
    messages,
    userMessage,
    user,
    chatName,
    handleMessagesScroll,
    setMessage,
    sendMessage,
  } = useChat();

  const messagesList = useMemo(() => {
    return messages.map((msg: IMessageExtended) => (
      <ChatMessage
        message={msg}
        fromSelf={msg.user_id == user?.id}
        key={msg.id}
      />
    ));
  }, [messages]);

  return (
    <div className={styles['container']}>
      <div className={styles['chat-header']}>{chatName}</div>
      <div
        className={styles['message-container']}
        onScroll={handleMessagesScroll}
      >
        {messagesList}
      </div>
      <form className={styles['input-container']} onSubmit={sendMessage}>
        <input
          className={styles['input']}
          type="text"
          value={userMessage}
          onChange={setMessage}
        />
        <button className={styles['button']}>send</button>
      </form>
    </div>
  );
}
