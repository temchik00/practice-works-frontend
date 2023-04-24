import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import IUser, { IUserResponse } from '../interfaces/IUser';

export const UserContext = createContext<{ user: IUser | undefined }>({
  user: undefined,
});

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const { isAuthorized } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const get_self = useCallback(async () => {
    if (isAuthorized) {
      const response = await axiosPrivate.get<IUserResponse>('/user/me');
      setUser({
        ...response.data,
        date_created: new Date(response.data.date_created),
      });
    }
  }, [isAuthorized, axiosPrivate, user]);

  useEffect(() => {
    if (isAuthorized) get_self();
    else setUser(undefined);
  }, [isAuthorized]);
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export default UserContext;
