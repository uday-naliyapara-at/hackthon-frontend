import { useTheme } from 'next-themes';

import { HiMoon, HiSun } from 'react-icons/hi';

import { Button, Icon } from '@/presentation/shared/atoms';

export interface ThemeToggleProps {
  'data-testid'?: string;
}

export function ThemeToggle({ 'data-testid': testId }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      data-testid={testId}
    >
      <Icon
        icon={isDark ? HiSun : HiMoon}
        className="h-6 w-6"
        data-testid={isDark ? 'sun-icon' : 'moon-icon'}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
