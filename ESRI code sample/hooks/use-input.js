import { useReducer } from 'react';

const initialInputState = {
  value: '',
  isTouched: false,
};

// Reducer for handling input 
const inputStateReducer = (state, action) => {
  if (action.type === 'INPUT') {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === 'BLUR') {
    return { isTouched: true, value: state.value };
  }
  if (action.type === 'RESET') {
    return { isTouched: false, value: '' };
  }
  return inputStateReducer;
};

const useInput = (validateValue) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;

  // Handle update input value state when the input changes
  const valueChangeHandler = (event) => {
    dispatch({ type: 'INPUT', value: event.target.value });
  };

  // Handle input behaviour when the input loses focus
  const inputBlurHandler = (event) => {
    dispatch({ type: 'BLUR' });
  };

  // Reset the input values and IsTouched state after the user submits the form
  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  // Return an object to be utilized by the component.
  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;