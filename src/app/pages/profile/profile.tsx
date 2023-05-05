import styles from './profile.module.scss';
import useProfile from './useProfile';

export default function Profile(props: any) {
  const { profileInfo, canModify, status } = useProfile();

  return (
    <div className={styles['container']}>
      {status === 'success' ? (
        <div className={styles['form']}>
          <div className={styles['entry']}>
            Логин:{' '}
            <span className={styles['entry-inserted']}>
              {profileInfo!.username}
            </span>{' '}
          </div>
          <div className={styles['entry']}>
            Имя:{' '}
            <span className={styles['entry-inserted']}>
              {profileInfo!.first_name || 'Не указано'}
            </span>{' '}
          </div>
          <div className={styles['entry']}>
            Фамилия:{' '}
            <span className={styles['entry-inserted']}>
              {profileInfo!.last_name || 'Не указано'}
            </span>{' '}
          </div>
          <div className={styles['entry']}>
            Дата регистрации:{' '}
            <span className={styles['entry-inserted']}>
              {profileInfo!.date_created.toLocaleDateString()}
            </span>{' '}
          </div>
        </div>
      ) : status === 'notFound' ? (
        <p>Пользователь не найден</p>
      ) : (
        <p>Возникла непредвиденная ошибка при загрузке страницы</p>
      )}
    </div>
  );
}
