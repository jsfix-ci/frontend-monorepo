import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createClient } from './lib/apollo-client';
import { EnvironmentProvider, NetworkLoader } from '@vegaprotocol/environment';
import {
  VegaConnectDialog,
  VegaManageDialog,
  VegaWalletProvider,
} from '@vegaprotocol/wallet';
import { Connectors } from './lib/vega-connectors';
import '../styles.scss';
import { AppLoader } from './components/app-loader';
import Header from './components/header';
import { Main } from './components/main';
import LocalContext from './context/local-context';
import useLocalValues from './hooks/use-local-values';

function App() {
  const localValues = useLocalValues();
  const {
    vegaWalletDialog,
    menu: { setMenuOpen },
  } = localValues;
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location, setMenuOpen]);

  return (
    <EnvironmentProvider>
      <NetworkLoader createClient={createClient}>
        <VegaWalletProvider>
          <LocalContext.Provider value={localValues}>
            <AppLoader>
              <div className="max-h-full min-h-full dark:bg-lite-black dark:text-neutral-200 bg-white text-neutral-800 grid grid-rows-[min-content,1fr]">
                <Header />
                <Main />
                <VegaConnectDialog
                  connectors={Connectors}
                  dialogOpen={vegaWalletDialog.connect}
                  setDialogOpen={vegaWalletDialog.setConnect}
                />
                <VegaManageDialog
                  dialogOpen={vegaWalletDialog.manage}
                  setDialogOpen={vegaWalletDialog.setManage}
                />
              </div>
            </AppLoader>
          </LocalContext.Provider>
        </VegaWalletProvider>
      </NetworkLoader>
    </EnvironmentProvider>
  );
}

export default App;
