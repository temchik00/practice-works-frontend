import { useCallback, useState } from 'react';
import useAuth from 'src/app/hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './authorization.module.scss';
import { useForm } from 'react-hook-form';
import ErrorMessage from 'src/app/components/errorMessage/errorMessage';

interface FormFields {
  username: string;
  password: string;
}

export default function Authorization() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({ mode: 'onTouched' });
  const { signIn } = useAuth();
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const login = useCallback(
    async (data: FormFields) => {
      let formData = new FormData();
      formData.set('username', data.username);
      formData.set('password', data.password);
      try {
        await signIn(formData);
        navigate(from, { replace: true });
      } catch (error: any) {
        if (error?.response?.status === 401)
          setAuthError('Неправильный логин или пароль');
      }
    },
    [signIn, navigate]
  );

  const clearAuthError = useCallback(() => {
    if (authError) setAuthError(undefined);
  }, [authError]);

  return (
    <div className={styles['container']}>
      <div className={styles['form']}>
        <form
          onSubmit={handleSubmit(login)}
          className={styles['form-content']}
          noValidate
          onChange={clearAuthError}
        >
          <h2 className={styles['form-header']}>Вход</h2>
          <div className={styles['input-group']}>
            <label htmlFor="username" className={styles['label']}>
              Логин <span className={styles['star']}>*</span>
            </label>
            <input
              type="text"
              id="username"
              placeholder="Логин"
              className={styles['input']}
              {...register('username', {
                required: {
                  value: true,
                  message: 'Поле обязательно для ввода',
                },
                minLength: {
                  value: 5,
                  message: 'Логин слишком короткий',
                },
                maxLength: {
                  value: 63,
                  message: 'Логин слишком длинный',
                },
              })}
            />
            {errors.username && (
              <ErrorMessage message={errors.username.message || 'Ошибка!'} />
            )}
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="password" className={styles['label']}>
              Пароль <span className={styles['star']}>*</span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Пароль"
              className={styles['input']}
              {...register('password', {
                required: {
                  value: true,
                  message: 'Поле обязательно для ввода',
                },
                minLength: {
                  value: 8,
                  message: 'Пароль слишком короткий',
                },
                maxLength: {
                  value: 26,
                  message: 'Пароль слишком длинный',
                },
              })}
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message || 'Ошибка!'} />
            )}
          </div>
          <div className={styles['input-group']}>
            <button type="submit" className={styles['action-button']}>
              Войти
            </button>
            {authError && <ErrorMessage message={authError} />}
          </div>
        </form>
        <Link
          to={'/signup'}
          state={{ from: from }}
          replace
          className={styles['link']}
        >
          Нет аккаунта?
        </Link>
      </div>
    </div>
  );
}
