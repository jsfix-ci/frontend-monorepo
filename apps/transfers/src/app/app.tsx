// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { t, ThemeContext, useThemeSwitcher } from '@vegaprotocol/react-helpers';
import { Button, ThemeSwitcher } from '@vegaprotocol/ui-toolkit';
import {
  useVegaWallet,
  VegaConnectDialog,
  VegaWalletProvider,
} from '@vegaprotocol/wallet';
import { RestConnector } from '@vegaprotocol/wallet';
import { useMemo, useState } from 'react';

export const rest = new RestConnector();

export const Connectors = {
  rest,
};

const Transfers = ({
  setConnectModalShown,
}: {
  setConnectModalShown: (value: boolean) => void;
}) => {
  const { keypair } = useVegaWallet();
  const isConnected = useMemo(() => keypair !== null, [keypair]);
  return isConnected ? null : (
    <Button onClick={() => setConnectModalShown(true)}>
      Connect Vega Wallet
    </Button>
  );
};

export function App() {
  const [dialogOpen, setDialogOpen] = useState(true);
  const [theme, toggleTheme] = useThemeSwitcher();
  return (
    <div className="antialiased m-0 bg-white dark:bg-black text-black dark:text-white h-full">
      <ThemeContext.Provider value={theme}>
        <VegaWalletProvider>
          <section className="text-center pt-32">
            <div className="flex justify-center mb-16">
              <h1 className="uppercase calt mr-8 font-alpha text-h3">
                {t('Transfers')}
              </h1>
              <ThemeSwitcher onToggle={toggleTheme} className="-my-4" />
            </div>
            <Transfers setConnectModalShown={setDialogOpen} />
            <VegaConnectDialog
              connectors={Connectors}
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
            />
          </section>
        </VegaWalletProvider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
