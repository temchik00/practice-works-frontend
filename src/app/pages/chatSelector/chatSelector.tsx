import { Link, Outlet } from 'react-router-dom';
import styles from './chatSelector.module.scss';
import useChatSelector from './useChatSelector';
import { useMemo } from 'react';
import IChat from 'src/app/interfaces/IChat';
import ChatMiniature from 'src/app/components/chatMiniature/chatMiniature';
import Dialog from 'src/app/components/dialog/dialog';

const ChatSelector = () => {
  const {
    chats,
    dialogOpen,
    chatTitle,
    openDialog,
    closeDialog,
    updateChatTitle,
    createChat,
  } = useChatSelector();

  const chatLinks = useMemo(() => {
    return chats.map((chat: IChat, index: number) => (
      <ChatMiniature chat={chat} key={chat.id} idx={index} />
    ));
  }, [chats, styles]);
  return (
    <>
      <div className={styles['container']}>
        <div className={styles['chats']}>
          <div className={styles['chats-header']}>
            <span className={styles['title']}>Чаты</span>
            <button className={styles['add-button']} onClick={openDialog}>
              Создать
            </button>
          </div>
          <div className={styles['chats-list']}>{chatLinks}</div>
        </div>
        <Outlet />
      </div>
      <Dialog
        visible={dialogOpen}
        title="Создание чата"
        rejectText="Отмена"
        acceptText="Создать"
        onReject={closeDialog}
        onAccept={createChat}
      >
        <label
          htmlFor="chat-create-title"
          className={styles['chat-create-label']}
        >
          Название чата
        </label>
        <input
          id="chat-create-title"
          name="chat-create-title"
          placeholder="Название чата"
          className={styles['chat-create-title']}
          value={chatTitle}
          onChange={updateChatTitle}
        />
      </Dialog>
    </>
  );
};

export default ChatSelector;
