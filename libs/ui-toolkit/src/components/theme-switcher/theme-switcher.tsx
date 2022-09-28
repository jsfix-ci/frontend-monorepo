import { useTheme } from '@vegaprotocol/react-helpers';
import React from 'react';
import { SunIcon, MoonIcon } from './icons';

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const classes = 'text-neutral-800 dark:text-neutral-300';
  return (
    <button
      type="button"
      onClick={() => toggle()}
      className={className}
      data-testid="theme-switcher"
    >
      {theme === 'dark' && (
        <span className={classes}>
          <SunIcon />
        </span>
      )}
      {theme === 'light' && (
        <span className={classes}>
          <MoonIcon />
        </span>
      )}
    </button>
  );
};
