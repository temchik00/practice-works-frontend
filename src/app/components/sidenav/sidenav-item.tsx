import styles from './sidenav.module.scss';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SidenavItemProps } from './SidenavItemProps';

export const SidenavItem = memo((props: SidenavItemProps) => {
  const content = useMemo(() => {
    return (
      <>
        <img
          src={`/assets/${props.iconPath}`}
          alt=""
          className={styles['side-pannel-item-icon']}
        />
        <div className={styles['side-pannel-item-text']}>{props.text}</div>
      </>
    );
  }, [props.iconPath, props.text, styles]);

  return (
    <>
      {props.href ? (
        <Link className={styles['side-pannel-item']} to={props.href}>
          {content}
        </Link>
      ) : (
        <div className={styles['side-pannel-item']} onClick={props!.onClick}>
          {content}
        </div>
      )}
    </>
  );
});
