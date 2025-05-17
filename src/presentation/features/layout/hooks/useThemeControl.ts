import { useTheme } from 'next-themes';

import { useEffect } from 'react';

export function useThemeControl() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Set initial theme
    const currentTheme = theme || 'light';
    document.documentElement.classList.add(currentTheme);
    return () => {
      document.documentElement.classList.remove(currentTheme);
    };
  }, [theme]);

  return {
    theme,
    setTheme,
  };
}
