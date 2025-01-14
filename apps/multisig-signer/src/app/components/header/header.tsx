import {
  BackgroundVideo,
  ThemeSwitcher,
  VegaLogo,
} from '@vegaprotocol/ui-toolkit';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header = ({ theme, toggleTheme }: HeaderProps) => {
  return (
    <header className="relative overflow-hidden py-2 mb-8">
      <BackgroundVideo />
      <div className="relative flex justify-center px-2 dark:bg-black bg-white">
        <div className="w-full max-w-3xl p-5 flex items-center justify-between">
          <VegaLogo />
          <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  );
};
