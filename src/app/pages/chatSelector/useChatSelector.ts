import { useCallback, useEffect, useState } from 'react';
import useAxiosPrivate from 'src/app/hooks/useAxiosPrivate';
import IChat from 'src/app/interfaces/IChat';

const useChatSelector = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [chatTitle, setChatTitle] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const getChats = useCallback(
    async (controller?: AbortController) => {
      try {
        const response = await axiosPrivate.get<IChat[]>(
          '/chat/my_chats',
          controller ? { signal: controller.signal } : undefined
        );
        setChats(response.data);
      } catch (error) {}
    },
    [chats, axiosPrivate]
  );

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, [dialogOpen]);

  const closeDialog = useCallback(() => {
    setChatTitle('');
    setDialogOpen(false);
  }, [dialogOpen, chatTitle]);

  const updateChatTitle = useCallback(
    (e: any) => {
      setChatTitle(e.target.value);
    },
    [chatTitle]
  );

  const createChat = useCallback(async () => {
    try {
      await axiosPrivate.post('/chat/', { name: chatTitle });
    } catch (error) {}
    setChatTitle('');
    setDialogOpen(false);
    try {
      await getChats();
    } catch (error) {}
  }, [dialogOpen, axiosPrivate, chatTitle, getChats]);

  useEffect(() => {
    const controller = new AbortController();
    getChats(controller);
    return () => {
      controller.abort();
    };
  }, []);
  return {
    chatTitle,
    chats,
    dialogOpen,
    openDialog,
    closeDialog,
    updateChatTitle,
    createChat,
  };
};

export default useChatSelector;
