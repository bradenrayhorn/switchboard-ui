import { useEffect, useRef } from 'react';

const useValueRef = (value) => {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  return valueRef;
};

export default useValueRef;
