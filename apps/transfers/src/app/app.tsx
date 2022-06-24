import { ApolloProvider, gql, useQuery } from '@apollo/client';
import {
  addDecimal,
  formatNumber,
  maxSafe,
  removeDecimal,
  required,
  t,
  ThemeContext,
  truncateByChars,
  useThemeSwitcher,
  vegaPublicKey,
} from '@vegaprotocol/react-helpers';
import { AccountType } from '@vegaprotocol/types';
import {
  Button,
  FormGroup,
  Input,
  InputError,
  Loader,
  Select,
  ThemeSwitcher,
} from '@vegaprotocol/ui-toolkit';
import { VegaKeyExtended, VegaManageDialog } from '@vegaprotocol/wallet';
import {
  useVegaTransaction,
  useVegaWallet,
  VegaConnectDialog,
  VegaWalletProvider,
} from '@vegaprotocol/wallet';
import { RestConnector } from '@vegaprotocol/wallet';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '../lib/apollo-client';
import type {
  PartyAccounts,
  PartyAccountsVariables,
  PartyAccounts_party_accounts,
} from './__generated__/PartyAccounts';

/*
- [ ] Support multilpe keys
- [ ] Use introspection query for account types
- [ ] Pull GQL URL from wallet config
- [ ] Wallet config types
- [ ] Show asset balances
- [ ] Show connected network and data node URL
- [ ] User stories
*/

export const rest = new RestConnector();

export const Connectors = {
  rest,
};

// TODO move to UI toolkit
interface UseButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const UseButton = ({ children, onClick }: UseButtonProps) => {
  return (
    <button
      type="button"
      className="ml-auto text-ui absolute top-0 right-0 underline"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const ACCOUNTS_QUERY = gql`
  query PartyAccounts($partyId: ID!) {
    party(id: $partyId) {
      accounts {
        asset {
          id
          name
          decimals
          symbol
        }
        type
        balance
      }
    }
  }
`;

interface FormFields {
  toAddress: string;
  amount: string;
}

const TransfersForm = ({
  account,
}: {
  account: PartyAccounts_party_accounts;
}) => {
  const { send, transaction } = useVegaTransaction();
  const { keypair } = useVegaWallet();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();
  const onSubmit = useCallback(
    (fields: FormFields) => {
      const transactionData = {
        pubKey: keypair?.pub,
        propagate: true,
        transfer: {
          fromAccountType: 'ACCOUNT_TYPE_GENERAL',
          toAccountType: 'ACCOUNT_TYPE_GENERAL',
          to: fields.toAddress,
          asset: account.asset.id,
          amount: removeDecimal(fields.amount, account.asset.decimals),
          oneOff: { deliverOn: 0 },
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      send(transactionData);
      console.log('send', transactionData);
    },
    [account.asset.decimals, account.asset.id, keypair?.pub, send]
  );
  const max = useMemo(
    () => addDecimal(account.balance, account.asset.decimals).toString(),
    [account.asset.decimals, account.balance]
  );
  return (
    <>
      <div className="flex flex-1 justify-between mb-16">
        <div>Balance:</div>
        <div>
          {max} {account.asset.symbol}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label={t('Amount:')}
          labelFor="toAddress"
          className="relative"
        >
          <Input
            {...register('amount', {
              validate: {
                required,
                maxSafe: (value) => maxSafe(new BigNumber(max))(value),
              },
            })}
            id="amount"
            hasError={Boolean(errors.amount?.message)}
            type="number"
            autoFocus={true}
            placeholder={t('10')}
          />
          {errors.amount?.message && (
            <InputError intent="danger">{errors.amount?.message}</InputError>
          )}
          <UseButton
            onClick={() => {
              setValue('amount', max);
            }}
          >
            {t('Use maximum')}
          </UseButton>
        </FormGroup>
        <FormGroup label={t('To (Vega Address):')} labelFor="toAddress">
          <Input
            {...register('toAddress', {
              validate: { required, vegaPublicKey },
            })}
            id="toAddress"
            hasError={Boolean(errors.toAddress?.message)}
            type="text"
            autoFocus={true}
            placeholder={t(
              'To address e.g. c443fb0388266c290736f325efeaad9aaa6d5f7f7b184f4e2302ecf8207b056e'
            )}
          />
          {errors.toAddress?.message && (
            <InputError intent="danger">{errors.toAddress?.message}</InputError>
          )}
        </FormGroup>
        <div className="text-center">
          <Button type="submit" variant="secondary">
            {t('Send')}
          </Button>
        </div>
        <div>{JSON.stringify(transaction)}</div>
      </form>
    </>
  );
};

const TransfersContainer = ({ keypair }: { keypair: VegaKeyExtended }) => {
  const { connector } = useVegaWallet();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  const [config, setConfig] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [account, setAsset] = useState<
    PartyAccounts_party_accounts | undefined
  >(undefined);
  const {
    loading: accountsLoading,
    error: accountsError,
    data,
  } = useQuery<PartyAccounts, PartyAccountsVariables>(ACCOUNTS_QUERY, {
    variables: { partyId: keypair.pub || '' },
  });
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await connector?.config();
        setConfig(res);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [connector]);
  useEffect(() => {
    const run = async () => {
      try {
        const res = await connector?.config();
        setConfig(res);
      } catch (e) {
        setError(e as Error);
      }
    };
    const interval = setInterval(run, 10 * 1000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [connector]);

  const accounts = useMemo(
    () => data?.party?.accounts?.filter((a) => a.type === AccountType.General),
    [data?.party?.accounts]
  );

  if (loading || accountsLoading) {
    return <Loader />;
  } else if (error || accountsError) {
    return <div>{error?.message || accountsError?.message}</div>;
  } else if (!accounts || accounts.length === 0) {
    return (
      // eslint-disable-next-line jsx-a11y/accessible-emoji
      <div>
        You don't have any assets with a general account balance above 0 😢
      </div>
    );
  }
  return (
    <section>
      {/* TODO */}
      {/* Connected to network: {config.name}
      Using host config: {JSON.stringify(config.api.grpc)}
      Using data node: {JSON.stringify(config.api.graphQl)} */}
      <FormGroup label={t('Asset:')} labelFor="asset" className="relative">
        <Select
          value={account?.asset.id}
          onChange={(e) =>
            setAsset(accounts?.find((a) => a.asset.id === e.target.value))
          }
        >
          <option value={undefined}>{t('Please select an asset')}</option>
          {accounts?.map((d) => {
            return (
              <option value={d.asset.id} key={d.asset.name}>
                {d.asset.name} ({d.asset.symbol}){' '}
              </option>
            );
          })}
        </Select>
      </FormGroup>
      {account && <TransfersForm account={account} />}
    </section>
  );
};

const Transfers = ({
  setConnectModalShown,
  setManageModalShown,
}: {
  setConnectModalShown: (value: boolean) => void;
  setManageModalShown: (value: boolean) => void;
}) => {
  const { keypair, keypairs } = useVegaWallet();

  console.log(keypair, keypairs);
  return keypair !== null ? (
    <>
      <div>Connected key: {truncateByChars(keypair.pub)}</div>
      <Button onClick={() => setManageModalShown(true)}>Change key</Button>
      <TransfersContainer keypair={keypair} />
    </>
  ) : (
    <div className="text-center">
      <Button onClick={() => setConnectModalShown(true)}>
        Connect Vega Wallet
      </Button>
    </div>
  );
};

export function App() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(true);
  const [manageKeysDialogOpen, setManageKeysDialogOpen] = useState(false);
  const [theme, toggleTheme] = useThemeSwitcher();
  // TODO this should be pulled from wallet config, but need to publish wallet config lib first
  const client = useMemo(
    () => createClient('https://lb.testnet.vega.xyz/query'),
    []
  );

  return (
    <div className="antialiased m-0 h-full flex justify-center vega-bg">
      <ThemeContext.Provider value={theme}>
        <ApolloProvider client={client}>
          <VegaWalletProvider>
            <section className="pt-32 border-x-1 px-64 w-[450px] dark:bg-black bg-white text-black dark:text-white ">
              <div className="flex justify-center mb-16">
                <h1 className="uppercase calt mr-8 font-alpha text-h3">
                  {t('Transfers')}
                </h1>
                <ThemeSwitcher onToggle={toggleTheme} className="-my-4" />
              </div>
              <Transfers
                setConnectModalShown={setConnectDialogOpen}
                setManageModalShown={setManageKeysDialogOpen}
              />
              <VegaConnectDialog
                connectors={Connectors}
                dialogOpen={connectDialogOpen}
                setDialogOpen={setConnectDialogOpen}
              />
              <VegaManageDialog
                dialogOpen={manageKeysDialogOpen}
                setDialogOpen={setManageKeysDialogOpen}
              />
            </section>
          </VegaWalletProvider>
        </ApolloProvider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
