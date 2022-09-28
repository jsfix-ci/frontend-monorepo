import { useEffect } from 'react';
import { useTheme } from './use-theme';

export const useThemeWatcher = () => {
  // storybook-addon-themes doesnt seem to provide the current selected
  // theme in context, we need to provide it in JS as some components
  // rely on it for rendering
  const { toggle } = useTheme();

  useEffect(() => {
    const observer = new MutationObserver((mutationList) => {
      if (mutationList.length) {
        const body = mutationList[0].target as HTMLElement;
        if (body.classList.contains('dark')) {
          toggle('dark');
        } else {
          toggle('light');
        }
      }
    });

    observer.observe(document.body, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [toggle]);
};
