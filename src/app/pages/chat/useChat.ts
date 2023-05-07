import {
  FormEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IMessage, { IMessageExtended } from 'src/app/interfaces/IMessage';
import axios from '../../api/axios';
import IUser, { IUserResponse } from 'src/app/interfaces/IUser';
import useAuth from 'src/app/hooks/useAuth';
import useAxiosPrivate from 'src/app/hooks/useAxiosPrivate';
import useUser from 'src/app/hooks/useUser';
import IChat from 'src/app/interfaces/IChat';

const page_size = 25;

const getUser = async (id: string | number): Promise<IUser> => {
  const response = await axios.get<IUserResponse>(`/user/${id}`);
  return {
    ...response.data,
    date_created: new Date(response.data.date_created),
  };
};

export function useChat() {
  const users = new Map<number, IUser>();

  const navigate = useNavigate();
  const { pureAccessToken: accessToken } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { chatId } = useParams();
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  const [messages, setMessages] = useState<IMessageExtended[]>([]);
  const [firstMessageId, setFirstMessageId] = useState<number | undefined>(
    undefined
  );
  const [userMessage, setUserMessage] = useState<string>('');
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>('');
  const { user } = useUser();

  const getChatName = useCallback(
    async (controller: AbortController) => {
      try {
        const response = await axiosPrivate.get<IChat>(`/chat/${chatId}`, {
          signal: controller.signal,
        });
        setChatName(response.data.name);
      } catch (error) {}
    },
    [axiosPrivate, chatName, chatId]
  );

  const repackMessage = useCallback(
    (msg: IMessage): IMessageExtended => {
      msg.date_send = new Date(msg.date_send);
      const user = users.get(msg.user_id);
      if (!user) throw new Error();
      return { ...msg, user };
    },
    [users]
  );

  const repackMessages = useCallback(
    async (messages: IMessage[]): Promise<IMessageExtended[]> => {
      let ids = new Set<number>();
      messages.forEach((msg) => {
        ids.add(msg.user_id);
      });
      users.forEach((val, key) => ids.delete(key));
      if (ids.size > 0) {
        let promises = Array.from(ids).map((id: number) => getUser(id));
        let newUsers = await Promise.all(promises);
        newUsers.forEach((user: IUser) => users.set(user.id, user));
      }
      let repacked = messages.map((msg: IMessage) => repackMessage(msg));
      return repacked;
    },
    [repackMessage, users]
  );

  const addMessages = useCallback(
    (new_messages: IMessageExtended[]) => {
      setMessages((prev: IMessageExtended[]) => {
        let new_arr = [...prev, ...new_messages];
        new_arr.sort((a, b) => b.id - a.id);
        return new_arr;
      });
    },
    [messages]
  );

  const getMessages = useCallback(
    async (
      chatId: string,
      page_size: number,
      controller: AbortController | null,
      start?: number
    ) => {
      try {
        let params;
        if (start) params = { page_size, start };
        else params = { page_size };
        let new_messages = await axiosPrivate.get<IMessage[]>(
          `/chat/${chatId}/messages`,
          {
            params: params,
            signal: controller ? controller.signal : undefined,
          }
        );
        if (new_messages.data.length === 0) setFirstMessageId(-1);
        else if (!firstMessageId || firstMessageId > new_messages.data[0].id)
          setFirstMessageId(new_messages.data[0].id);
        const repacked = await repackMessages(new_messages.data);
        addMessages(repacked);
      } catch (error) {}
    },
    [axiosPrivate, firstMessageId, addMessages]
  );

  const handleSocketMessage = useCallback(
    async (event: MessageEvent<string>) => {
      let message: IMessage = JSON.parse(event.data);
      if (message.chat_id !== +chatId!) return;
      try {
        const extendedMessages = await repackMessages([message]);
        addMessages(extendedMessages);
      } catch {}
    },
    [chatId, addMessages]
  );

  const handleSocketError = useCallback((e: Event) => {
    console.log(e);
  }, []);

  const handleDisconnect = useCallback((e: CloseEvent) => {
    if (e.code === 4004) navigate('/404');
  }, []);

  const disconnect = useCallback((ws: WebSocket) => {
    console.log('disconnecting');
    if (ws === undefined) return;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    let fn = () => {
      ws.close(1000);
    };
    fn = fn.bind(ws);
    setTimeout(fn, 200);
  }, []);

  const connect = useCallback(
    (chatId: string) => {
      console.log('connecting');
      if (ws !== undefined) {
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close();
      }
      const baseUrl: string = process.env.NX_API_URL
        ? 'ws://' + process.env.NX_API_URL
        : 'ws://localhost:8002';
      let socket = new WebSocket(
        `${baseUrl}/ws/chat/${chatId}/messages?token=${accessToken}`
      );
      socket.onmessage = handleSocketMessage;
      socket.onerror = handleSocketError;
      socket.onclose = handleDisconnect;
      setWs(socket);
      return socket;
    },
    [ws, accessToken]
  );

  const setMessage = useCallback(
    (e: any) => {
      setUserMessage(e.target.value);
    },
    [userMessage]
  );

  const sendMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        await axiosPrivate.post(`/chat/${chatId}/message`, {
          content: userMessage,
        });
        setUserMessage('');
      } catch {}
    },
    [axiosPrivate, chatId, userMessage]
  );

  const handleMessagesScroll = useCallback(
    (event: SyntheticEvent) => {
      const target = event.currentTarget;
      const realHeight = target.scrollHeight - target.clientHeight;
      const scrollPos = realHeight + target.scrollTop;
      setShouldUpdate(scrollPos < 100);
    },
    [shouldUpdate]
  );

  useEffect(() => {
    const updateMessages = async () => {
      if (shouldUpdate && chatId && firstMessageId && firstMessageId != -1) {
        await getMessages(chatId, page_size, null, firstMessageId);
        setShouldUpdate(false);
      }
    };
    updateMessages();
  }, [shouldUpdate]);

  useEffect(() => {
    const abortController = new AbortController();
    let socket: WebSocket | null = null;
    if (chatId) {
      socket = connect(chatId);
      getMessages(chatId, page_size, abortController, firstMessageId);
      getChatName(abortController);
    }
    return () => {
      abortController.abort();
      if (socket) disconnect(socket);
    };
  }, [chatId]);

  return {
    messages,
    userMessage,
    user,
    chatName,
    handleMessagesScroll,
    setMessage,
    sendMessage,
  };
}
