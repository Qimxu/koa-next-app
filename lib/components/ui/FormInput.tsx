'use client';

import { Eye, EyeOff } from 'lucide-react';
import { usePasswordToggle } from '@/lib/hooks/usePasswordToggle';
import { useTranslations } from 'next-intl';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 输入框标签 */
  label: string;
  /** 输入框类型 */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  /** 错误信息 */
  error?: string;
  /** 是否显示密码切换按钮（仅 type='password' 时有效） */
  showPasswordToggle?: boolean;
  /** 右侧图标或按钮 */
  rightElement?: ReactNode;
  /** 容器类名 */
  containerClassName?: string;
  /** 标签类名 */
  labelClassName?: string;
  /** 输入框类名 */
  inputClassName?: string;
  /** 错误信息类名 */
  errorClassName?: string;
}

/**
 * FormInput - 表单输入框组件
 * 统一处理输入框样式、标签、错误显示和密码切换
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      type = 'text',
      error,
      showPasswordToggle = false,
      rightElement,
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      errorClassName = '',
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations('common');
    const passwordToggle = type === 'password' && showPasswordToggle ? usePasswordToggle() : null;

    const inputType = passwordToggle ? passwordToggle.inputType : type;

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        <label
          htmlFor={props.id || props.name}
          className={`block text-sm font-medium text-muted ${labelClassName}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={`
              w-full px-4 py-3
              bg-input-bg border border-input-border
              rounded-lg
              text-foreground placeholder-muted
              transition-all duration-200
              focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-error focus:border-error focus:ring-error' : ''}
              ${passwordToggle || rightElement ? 'pr-12' : ''}
              ${inputClassName}
            `}
            {...props}
          />
          {passwordToggle && (
            <button
              type="button"
              onClick={passwordToggle.togglePassword}
              disabled={disabled}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                p-1 rounded
                text-muted
                hover:text-foreground
                focus:outline-none focus:text-foreground
                disabled:opacity-50
                transition-colors duration-150
              "
              aria-label={passwordToggle.showPassword ? t('hidePassword') : t('showPassword')}
            >
              {passwordToggle.showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
          {!passwordToggle && rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {error && <p className={`text-sm text-error-light ${errorClassName}`}>{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
