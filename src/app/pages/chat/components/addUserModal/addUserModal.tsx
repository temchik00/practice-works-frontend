import Dialog from 'src/app/components/dialog/dialog';
import styles from './addUserModal.module.scss';
import { AddUserModalProps } from './AddUserModalProps';
import { useAddUserModal } from './useAddUserModal';
import React, { useMemo } from 'react';
import IUser from 'src/app/interfaces/IUser';

const ResultItem = React.memo(
  ({ user, onClick }: { user: IUser; onClick: () => void }) => {
    const username = useMemo(() => {
      let name = '';
      if (user.first_name) name += user.first_name + ' ';
      if (user.last_name) name += user.last_name + ' ';
      if (name.length > 0) name += `(${user.username})`;
      else name = user.username;
      return name;
    }, [user]);
    return (
      <li className={styles['search-result-item']} onClick={onClick}>
        {username}
      </li>
    );
  }
);

export default function AddUserModal(props: AddUserModalProps) {
  const { query, users, closeDialog, updateQuery, addUser } =
    useAddUserModal(props);

  const userList = useMemo(() => {
    return users.map((user: IUser) => {
      return (
        <ResultItem
          key={user.id}
          user={user}
          onClick={() => addUser(user.id)}
        />
      );
    });
  }, [users, addUser]);

  const searchResult = useMemo(() => {
    if (!query) return null;
    if (!users.length)
      return <div className={styles['no-items']}>Пользователи не найдены</div>;
    return <ul className={styles['search-result']}>{userList}</ul>;
  }, [users, userList, query]);

  return (
    <Dialog
      visible={props.dialogOpen}
      title="Добавление пользователя"
      rejectText="Отмена"
      onReject={closeDialog}
    >
      <label htmlFor="chat-add-user" className={styles['chat-add-user-label']}>
        Логин пользователя
      </label>
      <input
        id="chat-add-user"
        name="chat-add-user"
        placeholder="Логин пользователя"
        type="text"
        className={styles['chat-add-user']}
        value={query}
        onChange={updateQuery}
      />
      {searchResult}
    </Dialog>
  );
}
