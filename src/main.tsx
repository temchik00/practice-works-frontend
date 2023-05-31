import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './app/context/authContext';
import RequireAuth from './app/components/routeHelpers/requireAuth';
import Root from './app/pages/root/root';
import Calculator from './app/pages/calculator/calculator';
import Authorization from './app/pages/authorization/authorization';
import Profile from './app/pages/profile/profile';
import Chat from './app/pages/chat/chat';
import PersistLogin from './app/components/routeHelpers/persistLogin';
import Registration from './app/pages/registration/registration';
import { UserProvider } from './app/context/userContext';
import NotFound from './app/pages/notFound/notFound';
import ErrorRedirect from './app/components/routeHelpers/errorRedirect';
import ChatSelector from './app/pages/chatSelector/chatSelector';
import Telegram from './app/pages/telegram/telegram';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorRedirect />,
    children: [
      { path: '404', element: <NotFound /> },
      { path: 'telegram', element: <Telegram /> },
      { path: 'calculator', element: <Calculator /> },
      { path: 'signin', element: <Authorization /> },
      { path: 'signup', element: <Registration /> },
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth />,
            // protected paths
            children: [
              { path: 'profile', element: <Profile /> },
              {
                path: 'chat',
                element: <ChatSelector />,
                children: [{ path: ':chatId', element: <Chat /> }],
              },
            ],
          },
        ],
      },
      { path: 'profile/:profileId', element: <Profile /> },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
