import { useEffect, useRef } from 'react';
import styles from './telegram.module.scss';

export default function Telegram() {
  const ref = useRef<HTMLDivElement>(null);
  const discussion = process.env.NX_TELEGRAM_DISCUSSION

  useEffect(() => {
    if (ref.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-discussion', discussion!);
      script.setAttribute('data-comments-limit', '5');
      script.setAttribute('data-color', 'FF8624');
      script.setAttribute('data-dark', '1');
      script.async = true;
      ref.current.appendChild(script);
    }
    return () => {
      if (ref.current) {
        ref.current.replaceChildren();
      }
    };
  }, []);
  return <div className={styles['widget-container']} ref={ref}></div>;
}
