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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
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
              { path: 'chat', element: <Chat /> },
            ],
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
