import '../src/styles.css';
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: { disable: true },
  layout: 'fullscreen',
  a11y: {
    config: {
      rules: [
        {
          // Disabled only for storybook because we display both the dark and light variants of the components on the same page without differentiating the ids, so it will always error.
          id: 'duplicate-id-aria',
          selector: '[data-testid="form-group"] > label',
        },
        {
          // Disabled because we can't control the radix radio group component and it claims to be accessible to begin with, so hopefully no issues.
          id: 'button-name',
          selector: '[role=radiogroup] > button',
        },
      ],
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'sideBySide', title: 'Side by side' },
      ],
      showName: true,
    },
  },
};

const StoryWrapper = ({ children, className, style }) => (
  <div style={style} className={className}>
    <div className="p-4">
      <div className="dark:bg-black dark:text-neutral-200 bg-white text-neutral-800">
        {children}
      </div>
    </div>
  </div>
);

const lightThemeClasses = 'bg-white text-black';
const darkThemeClasses = 'dark bg-black text-white';

const withTheme = (Story, context) => {
  const theme = context.parameters.theme || context.globals.theme;
  const storyClasses = `h-[100vh] w-[100vw] ${
    theme === 'dark' ? darkThemeClasses : lightThemeClasses
  }`;

  document.body.classList.toggle('dark', theme === 'dark');

  return theme === 'sideBySide' ? (
    <>
      <div className={lightThemeClasses}>
        <StoryWrapper>
          <Story />
        </StoryWrapper>
      </div>
      <div className={darkThemeClasses}>
        <StoryWrapper>
          <Story />
        </StoryWrapper>
      </div>
    </>
  ) : (
    <div className={storyClasses}>
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    </div>
  );
};

export const decorators = [withTheme];
