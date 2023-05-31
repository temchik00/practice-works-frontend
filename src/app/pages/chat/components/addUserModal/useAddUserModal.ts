import { useCallback, useEffect, useState } from 'react';
import useAxiosPrivate from 'src/app/hooks/useAxiosPrivate';
import { AddUserModalProps } from './AddUserModalProps';
import IUser, { IUserResponse } from 'src/app/interfaces/IUser';

function repackUser(user: IUserResponse) {
  return <IUser>{ ...user, date_created: new Date(user.date_created) };
}

export function useAddUserModal({
  chatId,
  dialogOpen,
  setDialogOpen,
}: AddUserModalProps) {
  const axiosPrivate = useAxiosPrivate();
  const [query, setQuery] = useState<string>('');
  const [users, setUsers] = useState<IUser[]>([]);
  const [chatUsers, setChatUsers] = useState<number[]>([]);

  const closeDialog = useCallback(() => {
    setQuery('');
    setUsers([]);
    setDialogOpen(false);
  }, [dialogOpen, query]);

  const updateQuery = useCallback(
    (e: any) => {
      setQuery(e.target.value);
    },
    [query]
  );

  const getUsers = useCallback(
    async (query: string, controller: AbortController) => {
      if (!query) {
        setUsers([]);
        return;
      }
      const result = await axiosPrivate.get<IUserResponse[]>('/user/', {
        params: { match: query },
        signal: controller.signal,
      });
      const newUsers = result.data
        .filter((user: IUserResponse) => !chatUsers.includes(user.id))
        .map((user: IUserResponse) => repackUser(user));
      setUsers(newUsers);
    },
    [users, chatUsers, repackUser]
  );

  const getChatUsers = useCallback(
    async (controller: AbortController) => {
      const result = await axiosPrivate.get<IUserResponse[]>(
        `/chat/${chatId}/users`,
        {
          signal: controller.signal,
        }
      );
      const newUsers = result.data.map((user: IUserResponse) => user.id);
      setChatUsers(newUsers);
    },
    [chatUsers, chatId]
  );

  useEffect(() => {
    const abortController = new AbortController();
    getUsers(query, abortController);
    return () => {
      abortController.abort();
    };
  }, [query]);

  const addUser = useCallback(
    async (userId: number) => {
      try {
        await axiosPrivate.post(`/chat/${chatId}/user`, { user_id: userId });
      } catch (error) {}
      setQuery('');
      setUsers([]);
      setDialogOpen(false);
    },
    [dialogOpen, axiosPrivate, chatId]
  );

  useEffect(() => {
    const abortController = new AbortController();
    if (dialogOpen) getChatUsers(abortController);
    return () => {
      abortController.abort();
    };
  }, [dialogOpen]);

  return {
    query,
    users,
    updateQuery,
    closeDialog,
    addUser,
  };
}
