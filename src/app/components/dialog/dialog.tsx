import IDialogProps from './DialogProps';
import useDialog from './useDialog';
import styles from './dialog.module.scss';

const Dialog = (props: IDialogProps) => {
  const { classes, ref } = useDialog(props);
  return (
    <dialog ref={ref} className={classes} style={props.style}>
      <div className={styles['container']}>
        <h3 className={styles['title']}>{props.title}</h3>
        {props.children}
        <div className={styles['buttons-container']}>
          <button
            className={`${styles['button']} ${styles['button-reject']}`}
            onClick={props.onReject}
          >
            {props.rejectText}
          </button>
          {props.onAccept && (
            <button
              className={`${styles['button']} ${styles['button-accept']}`}
              onClick={props.onAccept}
            >
              {props.acceptText}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
