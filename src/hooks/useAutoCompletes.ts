import { useState, useEffect, useRef } from 'react';
import { AutoCompleteItemProps } from '../components/AutoCompletes';

type AutoCompletes = AutoCompleteItemProps[];

export default function useAutoCompletes(initialState: AutoCompletes = []) {
  const [autoCompletes, setAutoCompletes] = useState(initialState);
  const [autoCompletesVisible, setAutoCompletesVisible] = useState(true);
  const savedRef = useRef<AutoCompletes>();
  const stashRef = useRef<AutoCompletes>();

  useEffect(() => {
    savedRef.current = autoCompletes;
  }, [autoCompletes]);

  const prepend = (list: AutoCompletes) => {
    setAutoCompletes((prev) => [...list, ...prev]);
  };

  // prepend、replace 后立即 save 只会保存上一个状态
  // 因为 savedRef.current 的更新优先级最后，用 setTimeout 可解
  const save = () => {
    stashRef.current = savedRef.current;
  };

  const pop = () => {
    if (stashRef.current) {
      setAutoCompletes(stashRef.current);
    }
  };

  return {
    autoCompletes,
    prepend,
    setAutoCompletes,
    autoCompletesVisible,
    setAutoCompletesVisible,
    save,
    pop,
  };
}
