import { useCallback, useState } from 'react';
import useAuth from 'src/app/hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './registration.module.scss';

export default function Registration() {
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { signUp } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const create = useCallback(
    async (e: any) => {
      e.preventDefault();
      try {
        await signUp(username, password);
        navigate(from, { replace: true });
      } catch (error) {}
    },
    [username, password, signUp]
  );

  return (
    <form onSubmit={create}>
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
