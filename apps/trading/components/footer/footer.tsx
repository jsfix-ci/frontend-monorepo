import { useEnvironment } from '@vegaprotocol/environment';
import { Indicator, Intent } from '@vegaprotocol/ui-toolkit';
import { Vega } from '../icons/vega';
import get from 'lodash/get';

export const Footer = () => {
  const { VEGA_ENV, VEGA_NETWORKS } = useEnvironment();
  return (
    <footer className="px-4 py-2 text-xs border-t border-neutral-300 dark:border-neutral-700">
      <div className="flex justify-between">
        <div>
          <Indicator
            variant={
              get(VEGA_NETWORKS, VEGA_ENV) ? Intent.Success : Intent.Danger
            }
          />
          Status
        </div>
        <Vega className="w-13" />
      </div>
    </footer>
  );
};
