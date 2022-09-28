import { VegaLogo, ThemeSwitcher } from '@vegaprotocol/ui-toolkit';
import { VegaBackgroundVideo } from '../videos';

export const Header = () => {
  return (
    <header className="relative overflow-hidden py-8 mb-40 md:mb-64">
      <VegaBackgroundVideo />
      <div className="relative flex justify-center px-8 dark:bg-black bg-white">
        <div className="w-full max-w-3xl p-20 flex items-center justify-between">
          <VegaLogo />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
