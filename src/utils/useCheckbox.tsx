import { useState, useCallback } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface UseCheckboxOptions {
  initialState?: boolean;
  onChange?: (checked: boolean) => void;
}

export const useCheckbox = ({ 
  initialState = false, 
  onChange 
}: UseCheckboxOptions = {}) => {
  const [checked, setChecked] = useState(initialState);
  
  const toggle = useCallback((e: CheckboxChangeEvent) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    return newValue;
  }, [onChange]);
  
  return { 
    checked, 
    toggle, 
    setChecked 
  };
};