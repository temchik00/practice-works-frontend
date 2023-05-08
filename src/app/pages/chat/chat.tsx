import { useMemo } from 'react';
import styles from './chat.module.scss';
import { useChat } from './useChat';
import { IMessageExtended } from 'src/app/interfaces/IMessage';
import ChatMessage from 'src/app/components/chatMessage/chatMessage';
import Dialog from 'src/app/components/dialog/dialog';

export default function Chat() {
  const {
    messages,
    userMessage,
    user,
    chatName,
    dialogOpen,
    addUserId,
    handleMessagesScroll,
    setMessage,
    sendMessage,
    openDialog,
    closeDialog,
    updateUserId,
    addUser,
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
      <Dialog
        visible={dialogOpen}
        title="Добавление пользователя"
        rejectText="Отмена"
        acceptText="Добавить"
        onReject={closeDialog}
        onAccept={addUser}
      >
        <label
          htmlFor="chat-add-user"
          className={styles['chat-add-user-label']}
        >
          Id пользователя
        </label>
        <input
          id="chat-add-user"
          name="chat-add-user"
          placeholder="Id пользователя"
          type="number"
          className={styles['chat-add-user']}
          value={addUserId}
          onChange={updateUserId}
        />
      </Dialog>
    </>
  );
}
