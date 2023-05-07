import { Navigate, useRouteError } from 'react-router-dom';

const ErrorRedirect = () => {
  const error: any = useRouteError();
  return (
    <>
      {error?.status == 404 ? (
        <Navigate to="/404" />
      ) : (
        <p>Произошла непредвиденная ошибка</p>
      )}
    </>
  );
};

export default ErrorRedirect;
