import { Outlet } from 'react-router-dom';
import { Sidenav } from 'src/app/components/sidenav/sidenav';

import styles from './root.module.scss';

export default function Root() {
  return (
    <div className={styles['container']}>
      <Sidenav />
      <div className={styles['children-container']}>
        <Outlet />
      </div>
    </div>
  );
}
