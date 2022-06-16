import { ApolloProvider, gql, useQuery } from '@apollo/client';
import {
  addDecimal,
  maxSafe,
  required,
  t,
  ThemeContext,
  useThemeSwitcher,
  vegaPublicKey,
} from '@vegaprotocol/react-helpers';
import {
  Button,
  FormGroup,
  Input,
  InputError,
  Loader,
  Select,
  ThemeSwitcher,
} from '@vegaprotocol/ui-toolkit';
import {
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
  PartyAccounts_party_accounts,
} from './__generated__/PartyAccounts';

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

const ACCOUNT_TYPES = [
  { type: 'ACCOUNT_TYPE_UNSPECIFIED', id: 0, description: 'Default value' },
  {
    type: 'ACCOUNT_TYPE_INSURANCE',
    id: 1,
    description:
      'Insurance pool accounts contain insurance pool funds for a market',
  },
  {
    type: 'ACCOUNT_TYPE_SETTLEMENT',
    id: 2,
    description:
      'Settlement accounts exist only during settlement or mark-to-market',
  },
  {
    type: 'ACCOUNT_TYPE_MARGIN',
    id: 3,
    description:
      'Margin accounts contain margin funds for a party and each party will',
  },
  {
    type: 'ACCOUNT_TYPE_GENERAL',
    id: 4,
    description:
      'General accounts contains general funds for a party. A party will',
  },
  {
    type: 'ACCOUNT_TYPE_FEES_INFRASTRUCTURE',
    id: 5,
    description:
      'Infrastructure accounts contain fees earned by providing infrastructure on Vega',
  },
  {
    type: 'ACCOUNT_TYPE_FEES_LIQUIDITY',
    id: 6,
    description:
      'Liquidity accounts contain fees earned by providing liquidity on Vega markets',
  },
  {
    type: 'ACCOUNT_TYPE_FEES_MAKER',
    id: 7,
    description:
      'This account is created to hold fees earned by placing orders that sit on the book',
  },
  {
    type: 'ACCOUNT_TYPE_LOCK_WITHDRAW',
    id: 8,
    description:
      'This account is created to lock funds to be withdrawn by parties',
  },
  {
    type: 'ACCOUNT_TYPE_BOND',
    id: 9,
    description:
      'This account is created to maintain liquidity providers funds commitments',
  },

  {
    type: 'ACCOUNT_TYPE_EXTERNAL',
    id: 10,
    description:
      'External account represents an external source (deposit/withdrawal)',
  },
  {
    type: 'ACCOUNT_TYPE_GLOBAL_INSURANCE',
    id: 11,
    description: 'Global insurance account for the asset',
  },
  {
    type: 'ACCOUNT_TYPE_GLOBAL_REWARD',
    id: 12,
    description: '	Global reward account for the asset',
  },
  {
    type: 'ACCOUNT_TYPE_PENDING_TRANSFERS',
    id: 13,
    description: '	Per asset account used to store pending transfers (if any)',
  },
  {
    type: 'ACCOUNT_TYPE_REWARD_TAKER_PAID_FEES',
    id: 14,
    description: '	Per asset reward account for fees paid by takers',
  },
  {
    type: 'ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES',
    id: 15,
    description: '	Per asset reward account for fees received by makers',
  },
  {
    type: 'ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES',
    id: 16,
    description:
      '	Per asset reward account for fees received by liquidity providers',
  },
  {
    type: 'ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS',
    id: 17,
    description:
      '	Per asset reward account for market proposers when the market goes above some trading threshold',
  },
];

const ACCOUNTS_QUERY = gql`
  query PartyAccounts {
    party(
      id: "c443fb0388266c290736f325efeaad9aaa6d5f7f7b184f4e2302ecf8207b056e"
    ) {
      accounts {
        asset {
          id
          name
          decimals
        }
        balance
      }
    }
  }
`;

interface FormFields {
  toAddress: string;
  amount: string;
  fromAccountType: string;
  toAccountType: string;
}

const TransfersForm = ({
  account,
}: {
  account: PartyAccounts_party_accounts;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();
  const onSubmit = useCallback((fields: FormFields) => {
    console.log('send', fields);
  }, []);
  const max = useMemo(
    () => addDecimal(account.balance, account.asset.decimals).toString(),
    [account.asset.decimals, account.balance]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup label={t('Amount:')} labelFor="toAddress" className="relative">
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
          {...register('toAddress', { validate: { required, vegaPublicKey } })}
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
      <FormGroup label={t('From account type:')} labelFor="fromAccountType">
        <Select
          {...register('fromAccountType', { validate: { required } })}
          id="asset"
        >
          <option value="">
            {t('Please select (you probably want general)')}
          </option>
          {ACCOUNT_TYPES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.type} ({a.description})
            </option>
          ))}
        </Select>
        {errors.fromAccountType?.message && (
          <InputError intent="danger" className="mt-4" forInput="asset">
            {errors.fromAccountType?.message}
          </InputError>
        )}
      </FormGroup>
      <FormGroup label={t('To account type:')} labelFor="toAccountType">
        <Select
          {...register('toAccountType', { validate: { required } })}
          id="asset"
        >
          <option value="">
            {t('Please select (you probably want general)')}
          </option>
          {ACCOUNT_TYPES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.type} ({a.description})
            </option>
          ))}
        </Select>
        {errors.toAccountType?.message && (
          <InputError intent="danger" className="mt-4" forInput="asset">
            {errors.toAccountType?.message}
          </InputError>
        )}
      </FormGroup>
      <div className="text-center">
        <Button type="submit" variant="secondary">
          {t('Send')}
        </Button>
      </div>
    </form>
  );
};

const TransfersContainer = () => {
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
  } = useQuery<PartyAccounts>(ACCOUNTS_QUERY);
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
  if (loading || accountsLoading) {
    return <Loader />;
  } else if (error || accountsError) {
    return <div>{error?.message || accountsError?.message}</div>;
  }
  // TODO add empty state for if party does not exist or party has no money
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
            setAsset(
              data?.party?.accounts?.find((a) => a.asset.id === e.target.value)
            )
          }
        >
          <option value={undefined}>{t('Please select an asset')}</option>
          {data?.party?.accounts?.map((d) => {
            return (
              <option value={d.asset.id} key={d.asset.name}>
                {d.asset.name}
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
}: {
  setConnectModalShown: (value: boolean) => void;
}) => {
  const { keypair } = useVegaWallet();
  const isConnected = useMemo(() => keypair !== null, [keypair]);
  return isConnected ? (
    <TransfersContainer />
  ) : (
    <div className="text-center">
      <Button onClick={() => setConnectModalShown(true)}>
        Connect Vega Wallet
      </Button>
    </div>
  );
};

export function App() {
  const [dialogOpen, setDialogOpen] = useState(true);
  const [theme, toggleTheme] = useThemeSwitcher();
  // TODO this should be pulled from wallet config
  const client = useMemo(
    () => createClient('https://lb.testnet.vega.xyz/query'),
    []
  );

  return (
    <div className="antialiased m-0 h-full flex justify-center vega-bg">
      <ThemeContext.Provider value={theme}>
        <ApolloProvider client={client}>
          <VegaWalletProvider>
            <section className="pt-32 border-x-1 px-64 w-[400px] dark:bg-black bg-white text-black dark:text-white ">
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
        </ApolloProvider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
