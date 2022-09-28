import './styles.scss';
import { useEffect, useState } from 'react';
import { useTheme } from '@vegaprotocol/react-helpers';
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: { disable: true },
  themes: {
    default: 'dark',
    list: [
      { name: 'dark', class: ['dark', 'bg-black'], color: '#000' },
      { name: 'light', class: '', color: '#FFF' },
    ],
  },
};

export const decorators = [
  (Story, context) => {
    // storybook-addon-themes doesnt seem to provide the current selected
    // theme in context, we need to provide it in JS as some components
    // rely on it for rendering
    const { toggle } = useTheme();

    useEffect(() => {
      const observer = new MutationObserver((mutationList) => {
        if (mutationList.length) {
          const body = mutationList[0].target;
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

    return (
      <div style={{ width: '100%', height: 500 }}>
        <Story />
      </div>
    );
  },
];
