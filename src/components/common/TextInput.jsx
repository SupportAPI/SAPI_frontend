import React, { forwardRef } from 'react';
import { IoClose } from 'react-icons/io5'; // x 아이콘

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const defaultTheme = {
  primary: 'gray-700',
  error: 'red-500',
  background: 'white dark:bg-dark-background dark:text-dark-text',
};

const TextInput = forwardRef(
  (
    {
      label,
      error,
      helpText,
      containerClassName,
      labelClassName,
      inputClassName,
      required = false,
      disabled = false,
      theme = defaultTheme,
      id,
      multiline = false,
      rows = 3,
      clearable = false,
      onClear,
      fixedLabel = false, // 새로운 옵션 추가
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState(props.defaultValue || props.value || '');

    const handleChange = (e) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    const handleClear = () => {
      setValue('');
      props.onChange?.({ target: { value: '' } });
      onClear?.();
    };

    const baseContainerClass = 'relative w-full'; // 부모 컨테이너를 relative로 설정
    const baseInputClass = cn(
      'w-full px-3 py-2 text-gray-700 border rounded-md peer outline-none transition-colors dark:bg-dark-background dark:text-dark-text',
      'placeholder:opacity-0 focus:placeholder:opacity-100',
      disabled && 'bg-gray-100 cursor-not-allowed',
      error ? `border-${theme.error} focus:border-${theme.error}` : `border-gray-300 focus:border-${theme.primary}`,
      multiline && 'resize-none',
      inputClassName
    );

    const InputComponent = multiline ? 'textarea' : 'input';

    const baseLabelClass = cn(
      'absolute left-3 transition-all duration-200 px-1',
      fixedLabel || value || focused
        ? `-top-2 text-sm ${error ? `text-${theme.error}` : `text-${theme.primary}`}`
        : 'top-2 text-base text-gray-500',
      `bg-${theme.background}`,
      disabled && 'cursor-not-allowed',
      labelClassName
    );

    const feedbackClass = cn(
      'absolute left-3 top-full text-xs mt-1 transition-opacity duration-200', // absolute와 위치 지정 추가
      error ? `text-${theme.error}` : 'text-gray-500'
    );

    const clearButtonClass = cn(
      'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer dark:text-dark-text',
      'hover:text-gray-700',
      disabled && 'hidden'
    );

    return (
      <div className={cn('space-y-1 relative', containerClassName)}>
        <div className={baseContainerClass}>
          <InputComponent
            {...props}
            id={id}
            ref={ref}
            rows={multiline ? rows : undefined}
            disabled={disabled}
            required={required}
            value={props.value ?? value}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={baseInputClass}
          />
          <label htmlFor={id} className={baseLabelClass}>
            {label}
            {required && <span className={`text-${theme.error} ml-1`}>*</span>}
          </label>
          {clearable && value && <IoClose className={clearButtonClass} onClick={handleClear} />}
        </div>
        {(error || helpText) && <div className={feedbackClass}>{error || helpText}</div>}
      </div>
    );
  }
);

TextInput.displayName = 'FloatingLabelInput';

export default TextInput;
