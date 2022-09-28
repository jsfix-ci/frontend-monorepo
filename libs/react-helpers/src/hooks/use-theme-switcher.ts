import { useCallback, useEffect, useState } from 'react';
import { LocalStorage } from '../lib/storage';

type ThemeVariant = typeof darkTheme | typeof lightTheme;

const darkTheme = 'dark';
const lightTheme = 'light';
const storageKey = 'theme';

const getCurrentTheme = () => {
  const theme = LocalStorage.getItem(storageKey);
  if (
    theme === darkTheme ||
    (!theme &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    return darkTheme;
  }
  return lightTheme;
};

const applyClass = (theme: ThemeVariant) => {
  if (theme === darkTheme) {
    document.documentElement.classList.add(darkTheme);
  } else {
    document.documentElement.classList.remove(darkTheme);
  }
};

export function useThemeSwitcher(): [ThemeVariant, () => void] {
  const [theme, setTheme] = useState<ThemeVariant>(lightTheme);
  useEffect(() => setTheme(getCurrentTheme()), []);
  useEffect(() => {
    const storedTheme = getCurrentTheme();
    applyClass(storedTheme);
    setTheme(storedTheme);
  }, []);

  const toggle = useCallback(() => {
    const newTheme = theme === darkTheme ? lightTheme : darkTheme;
    LocalStorage.setItem(storageKey, newTheme);
    applyClass(newTheme);
    setTheme(newTheme);
  }, [theme]);

  return [theme, toggle];
}
