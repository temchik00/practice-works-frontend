import { useCallback, useMemo, useReducer, useState } from 'react';
import styles from './calculator.module.scss';

const enum ActionType {
  ADD_DIGIT,
  OPERATION,
  CLEAR,
  DELETE_DIGIT,
  EVALUATE,
  SIGN,
}

type State = {
  overwrite: boolean;
  currentOperand: string | null;
  previousOperand: string | null;
  operation: string | null;
  evaluated: boolean;
};

type ReducerAction = {
  type: ActionType;
  payload: string;
};

const reducer = (state: State, { type, payload }: ReducerAction): State => {
  switch (type) {
    case ActionType.ADD_DIGIT:
      if (state.overwrite && payload != '.')
        return {
          ...state,
          currentOperand: payload,
          overwrite: false,
          evaluated: false,
        };
      if (payload == '.' && state.currentOperand?.includes('.')) return state;
      if (payload == '0' && state.currentOperand == '0') return state;
      if (state.currentOperand == '0' && payload != '.')
        return { ...state, currentOperand: payload, evaluated: false };
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload}`,
        evaluated: false,
      };
      break;

    case ActionType.OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.currentOperand == null) {
        return { ...state, operation: payload };
      }
      if (state.evaluated) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload,
          evaluated: false,
        };
      }
      return {
        ...state,
        previousOperand: state.previousOperand
          ? evaluate(state)
          : state.currentOperand,
        operation: payload,
        currentOperand: state.previousOperand
          ? evaluate(state)
          : state.currentOperand,
        overwrite: true,
      };
      break;

    case ActionType.EVALUATE:
      if (
        state.previousOperand == null ||
        state.operation == null ||
        (state.operation != '√' && state.currentOperand == null)
      )
        return state;
      return {
        ...state,
        currentOperand: evaluate(state),
        overwrite: true,
        evaluated: true,
      };
      break;

    case ActionType.CLEAR:
      return {
        previousOperand: null,
        currentOperand: '0',
        operation: null,
        overwrite: true,
        evaluated: false,
      };
      break;

    case ActionType.SIGN:
      if (!state.currentOperand || state.currentOperand == '0') return state;
      return {
        ...state,
        currentOperand:
          state.currentOperand[0] == '-'
            ? state.currentOperand.slice(1)
            : `-${state.currentOperand}`,
        evaluated: false,
      };
      break;

    case ActionType.DELETE_DIGIT:
      if (state.overwrite) {
        return { ...state, overwrite: false, currentOperand: '0' };
      }
      if (!state.currentOperand || state.currentOperand == '0') return state;
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: '0' };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
        evaluated: false,
      };
      break;

    default:
      throw new Error();
      break;
  }
};

const evaluate = (state: State) => {
  const prev = state.previousOperand ? parseFloat(state.previousOperand) : null;
  const curr = state.currentOperand ? parseFloat(state.currentOperand) : null;
  const operation = state.operation;
  if (prev === null || (curr == null && operation != '√')) {
    return '';
  }
  let res = 0;
  switch (operation) {
    case '+':
      res = prev + curr!;
      break;
    case '-':
      res = prev - curr!;
      break;
    case '*':
      res = prev * curr!;
      break;
    case '/':
      res = prev / curr!;
      break;
    case '√':
      res = Math.sqrt(prev);
      break;
    default:
      res = NaN;
      break;
  }
  if (isNaN(res) || !isFinite(res)) return 'Error';
  return res.toString();
};

const useCalculator = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {
      currentOperand: '0',
      previousOperand: null,
      operation: null,
      overwrite: true,
      evaluated: false,
    }
  );

  const history = useMemo(() => {
    if (!previousOperand || !operation) return ' ';
    return `${previousOperand} ${operation}`;
  }, [previousOperand, operation]);

  const primaryBtnCls = useMemo(
    () => `${styles['calc-button']} ${styles['primary-button']}`,
    [styles]
  );

  const secBtnCls = useMemo(
    () => `${styles['calc-button']} ${styles['sec-button']}`,
    [styles]
  );

  const handleSubmit: React.FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      const nativeEvent = e.nativeEvent as typeof e.nativeEvent & {
        submitter: any;
      };
      const data: DOMStringMap = nativeEvent.submitter.dataset;
      const action = data['action'];
      if (!action) return;
      if (action == 'number') {
        const value = data['value'];
        if (!value) return;
        dispatch({ type: ActionType.ADD_DIGIT, payload: value });
        return;
      }
      if (action == 'dot') {
        dispatch({ type: ActionType.ADD_DIGIT, payload: '.' });
        return;
      }
      if (action == 'sign') {
        dispatch({ type: ActionType.SIGN, payload: '.' });
        return;
      }
      if (action == 'result') {
        dispatch({ type: ActionType.EVALUATE, payload: '.' });
        return;
      }
      if (action == 'clear') {
        dispatch({ type: ActionType.CLEAR, payload: '.' });
        return;
      }
      if (action == 'del') {
        dispatch({ type: ActionType.DELETE_DIGIT, payload: '.' });
        return;
      }
      dispatch({ type: ActionType.OPERATION, payload: action });
    },
    [dispatch]
  );

  return {
    history,
    currentOperand,
    primaryBtnCls,
    secBtnCls,
    handleSubmit,
  };
};

export default useCalculator;
