// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ThemeContext, useThemeSwitcher } from '@vegaprotocol/react-helpers';
import { Button } from '@vegaprotocol/ui-toolkit';
import {
  // useVegaWallet,
  VegaConnectDialog,
  VegaWalletProvider,
} from '@vegaprotocol/wallet';
import { RestConnector } from '@vegaprotocol/wallet';
import type { ButtonHTMLAttributes } from 'react';
import { useState } from 'react';

export const rest = new RestConnector();

export const Connectors = {
  rest,
};

const ConnectToVegaWallet = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  // const { keypair } = useVegaWallet();
  // const isConnected = keypair !== null;

  return <Button {...props}>Connect Vega Wallet</Button>;
};

export function App() {
  const [dialogOpen, setDialogOpen] = useState(true);
  const [theme] = useThemeSwitcher();
  return (
    <div className="antialiased m-0 bg-white dark:bg-black text-black dark:text-white h-full">
      <ThemeContext.Provider value={theme}>
        <VegaWalletProvider>
          <section>
            <h1 className="uppercase calt mb-2 font-alpha text-h3">
              Transfers
            </h1>
            <ConnectToVegaWallet onClick={() => setDialogOpen(true)} />
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
