import styles from './calculator.module.scss';
import useCalculator from './useCalculator';

export default function Calculator(props: any) {
  const { primaryBtnCls, secBtnCls, handleSubmit, currentOperand, history } =
    useCalculator();
  return (
    <div className={styles['container']}>
      <form className={styles['form-content']} onSubmit={handleSubmit}>
        <div className={styles['screen']}>
          <div className={styles['screen-history']}>{history}</div>
          <div className={styles['screen-primary']}>{currentOperand}</div>
        </div>
        <button className={secBtnCls} data-action="/">
          /
        </button>
        <button className={secBtnCls} data-action="*">
          *
        </button>
        <button className={secBtnCls} data-action="√">
          √
        </button>
        <button className={secBtnCls} data-action="del">
          <img src="assets/backspace.svg" alt="" className={styles['img']} />
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="7">
          7
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="8">
          8
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="9">
          9
        </button>
        <button className={secBtnCls} data-action="+">
          +
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="4">
          4
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="5">
          5
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="6">
          6
        </button>
        <button className={secBtnCls} data-action="-">
          -
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="1">
          1
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="2">
          2
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="3">
          3
        </button>
        <button className={secBtnCls} data-action="sign">
          +/-
        </button>
        <button className={secBtnCls} data-action="clear">
          AC
        </button>
        <button className={primaryBtnCls} data-action="number" data-value="0">
          0
        </button>
        <button className={secBtnCls} data-action="dot">
          .
        </button>
        <button
          className={`${styles['calc-button']} ${styles['action-button']}`}
          data-action="result"
        >
          =
        </button>
      </form>
    </div>
  );
}
