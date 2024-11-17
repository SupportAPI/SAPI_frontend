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
      label, // Input 필드의 라벨 텍스트
      error, // 오류 메시지를 표시하기 위한 텍스트 (오류 상태를 나타냄)
      helpText, // 입력 필드에 대한 추가 설명을 제공하는 텍스트
      containerClassName, // 외부 컨테이너에 적용될 추가적인 클래스 이름 (커스텀 스타일 적용)
      labelClassName, // 라벨에 적용될 추가적인 클래스 이름 (커스텀 스타일 적용)
      inputClassName, // 입력 필드에 적용될 추가적인 클래스 이름 (커스텀 스타일 적용)
      required = false, // 필수 입력 필드 여부를 나타내는 Boolean 값 (기본값: false)
      disabled = false, // 입력 필드 비활성화 여부를 나타내는 Boolean 값 (기본값: false)
      theme = defaultTheme, // 입력 필드 및 라벨에 사용될 테마 (색상 등 커스텀 가능)
      id, // 입력 필드와 라벨을 연결하는 고유 ID (HTML의 `for` 속성과 연결)
      multiline = false, // 입력 필드를 다중 라인 (`textarea`)으로 사용할지 여부 (기본값: false)
      rows = 3, // `textarea`일 경우 입력 필드의 기본 줄 수를 설정 (기본값: 3)
      clearable = false, // 초기화 버튼 표시 여부
      onClear, // 초기화 시 호출될 콜백 함수
      ...props // 나머지 속성은 `input` 또는 `textarea` 요소로 전달 (ex. placeholder, value 등)
    },
    ref // React의 `forwardRef`를 통해 부모 컴포넌트에서 이 컴포넌트의 DOM 접근을 지원
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
      onClear?.(); // 초기화 시 콜백 호출
    };

    const baseContainerClass = 'relative w-full';
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
      value || focused
        ? `-top-2 text-sm ${error ? `text-${theme.error}` : `text-${theme.primary}`}`
        : 'top-2 text-base text-gray-500',
      `bg-${theme.background}`,
      disabled && 'cursor-not-allowed',
      labelClassName
    );

    const feedbackClass = cn(
      'text-xs px-1 mt-1 transition-opacity duration-200 min-h-[1rem]',
      error ? `text-${theme.error}` : 'text-gray-500'
    );

    const clearButtonClass = cn(
      'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer dark:text-dark-text',
      'hover:text-gray-700',
      disabled && 'hidden'
    );

    return (
      <div className={cn('space-y-1', containerClassName)}>
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
        <div className={feedbackClass}>{error || helpText}</div>
      </div>
    );
  }
);

TextInput.displayName = 'FloatingLabelInput';

export default TextInput;
