import classNames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NetworkSwitcher } from '@vegaprotocol/environment';
import { t } from '@vegaprotocol/react-helpers';
import { useGlobalStore } from '../../stores/global';
import { VegaWalletConnectButton } from '../vega-wallet-connect-button';
import { ThemeSwitcher } from '@vegaprotocol/ui-toolkit';
import { Vega } from '../icons/vega';

export const Navbar = () => {
  const { marketId, update } = useGlobalStore((store) => ({
    marketId: store.marketId,
    update: store.update,
  }));
  const tradingPath = marketId ? `/markets/${marketId}` : '/markets';
  return (
    <div className="dark px-4 flex items-stretch border-b border-default bg-black text-white">
      <div className="flex gap-4 mr-4 items-center h-full">
        <Link href="/" passHref={true}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            <Vega className="w-13" />
          </a>
        </Link>
        <NetworkSwitcher />
      </div>
      <nav className="flex items-center">
        {[
          {
            name: t('Trading'),
            path: tradingPath,
            exact: false,
          },
          { name: t('Portfolio'), path: '/portfolio' },
        ].map((route) => (
          <NavLink key={route.path} {...route} />
        ))}
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <ThemeSwitcher />
        <VegaWalletConnectButton
          setConnectDialog={(open) => update({ connectDialog: open })}
        />
      </div>
    </div>
  );
};

interface NavLinkProps {
  name: string;
  path: string;
  exact?: boolean;
  testId?: string;
}

const NavLink = ({ name, path, exact, testId = name }: NavLinkProps) => {
  const router = useRouter();
  const isActive =
    router.asPath === path || (!exact && router.asPath.startsWith(path));
  const linkClasses = classNames('mx-2 py-2 self-end border-b-4', {
    'border-vega-yellow text-white cursor-default': isActive,
    'border-transparent text-neutral-400 hover:text-neutral-300': !isActive,
  });
  return (
    <Link data-testid={testId} href={path} passHref={true}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={linkClasses}>{name}</a>
    </Link>
  );
};
