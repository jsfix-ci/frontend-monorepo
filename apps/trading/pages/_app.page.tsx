import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Navbar } from '../components/navbar';
import { t } from '@vegaprotocol/react-helpers';
import { VegaConnectDialog, VegaWalletProvider } from '@vegaprotocol/wallet';
import {
  EnvironmentProvider,
  envTriggerMapping,
  useEnvironment,
} from '@vegaprotocol/environment';
import { Connectors } from '../lib/vega-connectors';
import { AppLoader } from '../components/app-loader';
import { RiskNoticeDialog } from '../components/risk-notice-dialog';
import './styles.css';
import { useGlobalStore } from '../stores';
import {
  AssetDetailsDialog,
  useAssetDetailsDialogStore,
} from '@vegaprotocol/assets';
import { Footer } from '../components/footer';
import { useMemo } from 'react';

const DEFAULT_TITLE = t('Welcome to Vega trading!');

function AppBody({ Component, pageProps }: AppProps) {
  const { connectDialog, pageTitle, update } = useGlobalStore((store) => ({
    connectDialog: store.connectDialog,
    pageTitle: store.pageTitle,
    update: store.update,
  }));
  const { isOpen, symbol, trigger, setOpen } = useAssetDetailsDialogStore();

  const { VEGA_ENV } = useEnvironment();
  const networkName = envTriggerMapping[VEGA_ENV];

  const title = useMemo(() => {
    if (!pageTitle) return DEFAULT_TITLE;
    if (networkName) return `${pageTitle} [${networkName}]`;
    return pageTitle;
  }, [pageTitle, networkName]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="h-full relative dark:bg-black dark:text-white z-0 grid grid-rows-[min-content,1fr,min-content]">
        <AppLoader>
          <Navbar />
          <main data-testid={pageProps.page}>
            {/* @ts-ignore conflict between @types/react and nextjs internal types */}
            <Component {...pageProps} />
          </main>
          <Footer />
          <VegaConnectDialog
            connectors={Connectors}
            dialogOpen={connectDialog}
            setDialogOpen={(open) => update({ connectDialog: open })}
          />
          <AssetDetailsDialog
            assetSymbol={symbol}
            trigger={trigger || null}
            open={isOpen}
            onChange={setOpen}
          />
          <RiskNoticeDialog />
        </AppLoader>
      </div>
    </>
  );
}

function VegaTradingApp(props: AppProps) {
  return (
    <EnvironmentProvider>
      <VegaWalletProvider>
        <AppBody {...props} />
      </VegaWalletProvider>
    </EnvironmentProvider>
  );
}

export default VegaTradingApp;
