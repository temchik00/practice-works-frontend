import { useMemo } from 'react';
import styles from './chat.module.scss';
import { useChat } from './useChat';
import { IMessageExtended } from 'src/app/interfaces/IMessage';
import ChatMessage from 'src/app/components/chatMessage/chatMessage';
import AddUserModal from './components/addUserModal/addUserModal';

export default function Chat() {
  const {
    chatId,
    messages,
    userMessage,
    user,
    chatName,
    dialogOpen,
    handleMessagesScroll,
    setMessage,
    sendMessage,
    setDialogOpen,
    openDialog,
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
    <>
      <div className={styles['container']}>
        <div className={styles['chat-header']}>
          <div className={styles['title']}>{chatName}</div>
          <button className={styles['add-button']} onClick={openDialog}>
            Добавить
          </button>
        </div>
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
      <AddUserModal
        chatId={chatId}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}
