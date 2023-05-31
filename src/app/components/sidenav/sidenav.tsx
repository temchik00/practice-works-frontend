import styles from './sidenav.module.scss';
import { DefaultParams } from 'src/app/utils/defaultParams';
import { SidenavItem } from './sidenav-item';
import useAuth from 'src/app/hooks/useAuth';

export function Sidenav(props: DefaultParams) {
  const { isAuthorized, fullLogOut } = useAuth();
  return (
    <aside className={styles['side-pannel']}>
      <div className={styles['side-pannel-content']}>
        <SidenavItem href="profile" iconPath="profile.svg" text="Профиль" />
        <SidenavItem
          href="calculator"
          iconPath="calculator.svg"
          text="Калькулятор"
        />
        <SidenavItem href="chat" iconPath="message.svg" text="Чат" />
        <SidenavItem href="telegram" iconPath="telegram.svg" text="Телеграм" />
        {isAuthorized ? (
          <SidenavItem
            onClick={fullLogOut}
            iconPath="logout.svg"
            text="Выйти"
          />
        ) : (
          <SidenavItem href="signin" iconPath="login.svg" text="Войти" />
        )}
      </div>
    </aside>
  );
}
