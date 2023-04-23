import axios from '../api/axios';
import { FC, useState, ReactNode, createContext, useCallback } from 'react';
import IToken from '../interfaces/IToken';

type SignIn = (formdata: FormData) => Promise<void>;
type SignUp = (username: string, password: string) => Promise<void>;
type LogOut = () => void;
type FullLogOut = () => Promise<void>;
type Refresh = () => Promise<string>;

export const AuthContext = createContext<{
  isAuthorized: boolean | undefined;
  accessToken: string | undefined;
  signIn: SignIn;
  signUp: SignUp;
  refresh: Refresh;
  logout: LogOut;
  fullLogOut: FullLogOut;
}>({
  isAuthorized: undefined,
  accessToken: undefined,
  signIn: async () => {},
  signUp: async () => {},
  refresh: async () => '',
  logout: () => {},
  fullLogOut: async () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(
    undefined
  );

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const logout: LogOut = useCallback(() => {
    setIsAuthorized(false);
    setAccessToken(undefined);
  }, [accessToken, isAuthorized]);

  const fullLogOut: FullLogOut = useCallback(async () => {
    await axios.post(
      '/auth/logout',
      {},
      { headers: { Authorization: accessToken } }
    );
    logout();
  }, [accessToken, logout]);

  const signIn: SignIn = useCallback(
    async (formdata: FormData) => {
      try {
        const response = await axios.post<IToken>('/auth/signin', formdata);
        setAccessToken(`${response.data.type} ${response.data.access_token}`);
        setIsAuthorized(true);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [isAuthorized, accessToken, logout]
  );

  const signUp: SignUp = useCallback(
    async (username, password) => {
      try {
        const response = await axios.post<IToken>('/auth/signup', {
          username,
          password,
        });
        setAccessToken(`${response.data.type} ${response.data.access_token}`);
        setIsAuthorized(true);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [isAuthorized, accessToken, logout]
  );

  const refresh: Refresh = useCallback(async () => {
    try {
      const response = await axios.post<IToken>('/auth/refresh', {});
      const newAccessToken = `${response.data.type} ${response.data.access_token}`;
      setAccessToken(newAccessToken);
      setIsAuthorized(true);
      return newAccessToken;
    } catch (error) {
      logout();
      throw error;
    }
  }, [accessToken, isAuthorized, logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        accessToken,
        signIn,
        signUp,
        refresh,
        logout,
        fullLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
