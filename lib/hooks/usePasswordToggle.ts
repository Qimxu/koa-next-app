'use client';

import { useState, useCallback } from 'react';

/**
 * usePasswordToggle - 密码可见性切换 Hook
 * 封装密码显示/隐藏的状态和切换逻辑
 */
export function usePasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const showPasswordText = useCallback(() => {
    setShowPassword(true);
  }, []);

  const hidePasswordText = useCallback(() => {
    setShowPassword(false);
  }, []);

  return {
    /** 当前是否显示密码 */
    showPassword,
    /** 切换密码显示/隐藏 */
    togglePassword,
    /** 显示密码 */
    showPasswordText,
    /** 隐藏密码 */
    hidePasswordText,
    /** input 的 type 属性值 */
    inputType: showPassword ? 'text' : 'password',
  };
}
