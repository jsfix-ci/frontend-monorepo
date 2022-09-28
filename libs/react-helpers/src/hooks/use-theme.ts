import { useEffect } from 'react';
import create from 'zustand';
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

interface ThemeStore {
  theme: ThemeVariant;
  toggle: (theme?: ThemeVariant) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: lightTheme,
  toggle: (theme) => {
    set((curr) => {
      let newTheme: ThemeVariant;
      if (theme) {
        newTheme = theme;
      } else {
        newTheme = curr.theme === lightTheme ? darkTheme : lightTheme;
      }
      LocalStorage.setItem(storageKey, newTheme);
      applyClass(newTheme);
      return { theme: newTheme };
    });
  },
}));

export function useTheme() {
  const { theme, toggle } = useThemeStore();

  useEffect(() => {
    const storedTheme = getCurrentTheme();
    toggle(storedTheme);
  }, [toggle]);

  return { theme, toggle };
}
