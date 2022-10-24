import { Splash } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectToVega } from '../connect-to-vega';

interface VegaWalletContainerProps {
  render: (key: string) => ReactElement;
}

export const VegaWalletContainer = ({ render }: VegaWalletContainerProps) => {
  const { pubKey } = useVegaWallet();
  const { t } = useTranslation();

  if (!pubKey) {
    return (
      <Splash>
        <div className="text-center">
          <p className="mb-4" data-testid="connect-vega-wallet-text">
            {t('Connect your Vega wallet')}
          </p>
          <ConnectToVega />
        </div>
      </Splash>
    );
  }

  return render(pubKey);
};
