import { useCallback, useState } from 'react';
import useAuth from 'src/app/hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './authorization.module.scss';

export default function Authorization() {
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { signIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const login = useCallback(
    async (e: any) => {
      e.preventDefault();
      let formData = new FormData();
      formData.set('username', username);
      formData.set('password', password);
      try {
        await signIn(formData);
        navigate(from, { replace: true });
      } catch (error) {}
    },
    [username, password, signIn]
  );

  return (
    <form onSubmit={login}>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="text"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <input type="submit" />
    </form>
  );
}
