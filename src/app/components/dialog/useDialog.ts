import { useEffect, useMemo, useRef } from 'react';
import IDialogProps from './DialogProps';
import styles from './dialog.module.scss';

const useDialog = ({ visible, className }: IDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  const classes = useMemo(() => {
    let clsList = [styles['modal']];
    if (className) {
      if (Array.isArray(className)) clsList.push(...className);
      else clsList.push(className);
    }
    return clsList.join(' ');
  }, [className, styles]);

  useEffect(() => {
    if (visible && ref.current?.open !== true) ref.current?.showModal();
    else if (ref.current?.open !== false) ref.current?.close();
  }, [visible]);

  return { classes, ref };
};

export default useDialog;
