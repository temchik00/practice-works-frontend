import useAuth from 'src/app/hooks/useAuth';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthorized, refresh } = useAuth();

  const verifyRefreshToken = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, refresh]);

  useEffect(() => {
    !isAuthorized ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
