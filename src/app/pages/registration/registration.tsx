import { useCallback, useState } from 'react';
import useAuth from 'src/app/hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './registration.module.scss';
import { useForm } from 'react-hook-form';
import ErrorMessage from 'src/app/components/errorMessage/errorMessage';

interface FormFields {
  username: string;
  password: string;
  first_name: string | undefined;
  last_name: string | undefined;
}

export default function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({ mode: 'onTouched' });
  const { signUp } = useAuth();
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const create = useCallback(
    async (data: FormFields) => {
      try {
        await signUp(data);
        navigate(from, { replace: true });
      } catch (error: any) {
        if (error?.response?.status === 409) {
          setAuthError('Логин уже занят');
        }
      }
    },
    [signUp, authError]
  );

  const clearAuthError = useCallback(() => {
    setAuthError(undefined);
  }, [authError]);

  return (
    <div className={styles['container']}>
      <div className={styles['form']}>
        <form
          onSubmit={handleSubmit(create)}
          className={styles['form-content']}
          noValidate
          onChange={clearAuthError}
        >
          <h2 className={styles['form-header']}>Регистрация</h2>
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
                  message: 'Логин должен содержать минимум 5 символов',
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
                  message: 'Пароль должен содержать минимум 8 символов',
                },
                maxLength: {
                  value: 26,
                  message: 'Пароль должен содержать максимум 26 символов',
                },
              })}
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message || 'Ошибка!'} />
            )}
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="first_name" className={styles['label']}>
              Имя
            </label>
            <input
              type="text"
              id="first_name"
              placeholder="Имя"
              className={styles['input']}
              {...register('first_name', {
                maxLength: {
                  value: 40,
                  message: 'Имя слишком длинное',
                },
              })}
            />
            {errors.first_name && (
              <ErrorMessage message={errors.first_name.message || 'Ошибка!'} />
            )}
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="last_name" className={styles['label']}>
              Фамилия
            </label>
            <input
              type="text"
              id="last_name"
              placeholder="Фамилия"
              className={styles['input']}
              {...register('last_name', {
                maxLength: {
                  value: 40,
                  message: 'Фамилия слишком длинная',
                },
              })}
            />
            {errors.last_name && (
              <ErrorMessage message={errors.last_name.message || 'Ошибка!'} />
            )}
          </div>

          <div className={styles['input-group']}>
            <button type="submit" className={styles['action-button']}>
              Зарегистрироваться
            </button>
            {authError && <ErrorMessage message={authError} />}
          </div>
        </form>
        <Link
          to={'/signin'}
          state={{ from: from }}
          replace
          className={styles['link']}
        >
          Есть аккаунт?
        </Link>
      </div>
    </div>
  );
}
