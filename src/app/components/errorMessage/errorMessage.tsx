import styles from './errorMessage.module.scss';
import ErrorMessageProps from './ErrorMessageProps';
import { memo } from 'react';

const ErrorMessage = memo((props: ErrorMessageProps) => {
  return (
    <p className={styles['error']}>
      <img src="/assets/error.svg" className={styles['error-icon']} />
      {props.message}
    </p>
  );
});
export default ErrorMessage;
