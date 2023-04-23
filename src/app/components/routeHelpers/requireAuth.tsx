import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from 'src/app/hooks/useAuth';

const RequireAuth = () => {
  const { isAuthorized } = useAuth();
  const location = useLocation();

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
