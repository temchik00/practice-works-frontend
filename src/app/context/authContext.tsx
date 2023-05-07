import axios from '../api/axios';
import { FC, useState, ReactNode, createContext, useCallback } from 'react';
import IToken from '../interfaces/IToken';

type SignIn = (formdata: FormData) => Promise<void>;
type SignUp = (userdata: {
  username: string;
  password: string;
  first_name: string | undefined;
  last_name: string | undefined;
}) => Promise<void>;
type LogOut = () => void;
type FullLogOut = () => Promise<void>;
type Refresh = () => Promise<string>;

export const AuthContext = createContext<{
  isAuthorized: boolean | undefined;
  pureAccessToken: string | undefined;
  accessToken: string | undefined;
  signIn: SignIn;
  signUp: SignUp;
  refresh: Refresh;
  logout: LogOut;
  fullLogOut: FullLogOut;
}>({
  isAuthorized: undefined,
  pureAccessToken: undefined,
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
  const [pureAccessToken, setPureAccessToken] = useState<string | undefined>(
    undefined
  );

  const logout: LogOut = useCallback(() => {
    setIsAuthorized(false);
    setAccessToken(undefined);
    setPureAccessToken(undefined);
  }, [accessToken, isAuthorized, pureAccessToken]);

  const fullLogOut: FullLogOut = useCallback(async () => {
    try {
      await axios.post(
        '/auth/logout',
        {},
        { headers: { Authorization: accessToken } }
      );
    } finally {
      logout();
    }
  }, [accessToken, logout]);

  const signIn: SignIn = useCallback(
    async (formdata: FormData) => {
      try {
        const response = await axios.post<IToken>('/auth/signin', formdata);
        setAccessToken(`${response.data.type} ${response.data.access_token}`);
        setPureAccessToken(response.data.access_token);
        setIsAuthorized(true);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [isAuthorized, accessToken, logout, pureAccessToken]
  );

  const signUp: SignUp = useCallback(
    async (userdata) => {
      let data = new Map();
      for (const [key, value] of Object.entries(userdata)) {
        if (value) data.set(key, value);
      }
      try {
        const response = await axios.post<IToken>(
          '/auth/signup',
          Object.fromEntries(data)
        );
        setAccessToken(`${response.data.type} ${response.data.access_token}`);
        setPureAccessToken(response.data.access_token);
        setIsAuthorized(true);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [isAuthorized, accessToken, logout, pureAccessToken]
  );

  const refresh: Refresh = useCallback(async () => {
    try {
      const response = await axios.post<IToken>('/auth/refresh', {});
      const newAccessToken = `${response.data.type} ${response.data.access_token}`;
      setPureAccessToken(response.data.access_token);
      setAccessToken(newAccessToken);
      setIsAuthorized(true);
      return newAccessToken;
    } catch (error) {
      logout();
      throw error;
    }
  }, [accessToken, isAuthorized, logout, pureAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        accessToken,
        pureAccessToken,
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
