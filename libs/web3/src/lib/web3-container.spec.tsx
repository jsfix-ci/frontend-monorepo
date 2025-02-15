import { fireEvent, render, screen } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { Web3Container } from './web3-container';
import { Web3ConnectUncontrolledDialog } from './web3-connect-dialog';
import type { useWeb3React } from '@web3-react/core';
import type { NetworkParamsQuery } from '@vegaprotocol/react-helpers';
import { NetworkParamsDocument } from '@vegaprotocol/react-helpers';
import { EnvironmentProvider } from '@vegaprotocol/environment';

const defaultHookValue = {
  isActive: false,
  error: undefined,
  connector: null,
  chainId: 3,
} as unknown as ReturnType<typeof useWeb3React>;
let mockHookValue: ReturnType<typeof useWeb3React>;

const mockEthereumConfig = {
  network_id: '3',
  chain_id: '3',
  confirmations: 3,
  collateral_bridge_contract: {
    address: 'bridge address',
  },
};

const networkParamsQueryMock: MockedResponse<NetworkParamsQuery> = {
  request: {
    query: NetworkParamsDocument,
  },
  result: {
    data: {
      networkParametersConnection: {
        edges: [
          {
            node: {
              __typename: 'NetworkParameter',
              key: 'blockchains.ethereumConfig',
              value: JSON.stringify(mockEthereumConfig),
            },
          },
        ],
      },
    },
  },
};

const mockEnvironment = {
  VEGA_ENV: 'TESTNET',
  VEGA_URL: 'https://vega-node.url',
  VEGA_NETWORKS: JSON.stringify({}),
  GIT_BRANCH: 'test',
  GIT_COMMIT_HASH: 'abcdef',
  GIT_ORIGIN_URL: 'https://github.com/test/repo',
};

jest.mock('@web3-react/core', () => {
  const original = jest.requireActual('@web3-react/core');
  return {
    ...original,
    useWeb3React: jest.fn(() => mockHookValue),
  };
});

function setup(mock = networkParamsQueryMock) {
  return render(
    <EnvironmentProvider definitions={mockEnvironment}>
      <MockedProvider mocks={[mock]}>
        <Web3Container>
          <div>
            <div>Child</div>
            <div>{mockEthereumConfig.collateral_bridge_contract.address}</div>
          </div>
        </Web3Container>
      </MockedProvider>
      <Web3ConnectUncontrolledDialog />
    </EnvironmentProvider>
  );
}

it('Prompt to connect opens dialog', async () => {
  mockHookValue = defaultHookValue;
  setup();

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(
    await screen.findByText('Connect your Ethereum wallet')
  ).toBeInTheDocument();

  expect(screen.queryByText('Child')).not.toBeInTheDocument();
  expect(screen.queryByTestId('web3-connector-list')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Connect'));
  expect(screen.getByTestId('web3-connector-list')).toBeInTheDocument();
});

it('Error message is shown', async () => {
  const message = 'Opps! An error';
  mockHookValue = { ...defaultHookValue, error: new Error(message) };
  setup();

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(
    await screen.findByText(`Something went wrong: ${message}`)
  ).toBeInTheDocument();
  expect(screen.queryByText('Child')).not.toBeInTheDocument();
});

it('Checks that chain ID matches app ID', async () => {
  const expectedChainId = 4;
  mockHookValue = {
    ...defaultHookValue,
    isActive: true,
    chainId: expectedChainId,
  };
  setup();

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(
    await screen.findByText(`This app only works on chain ID: 3`)
  ).toBeInTheDocument();
  expect(screen.queryByText('Child')).not.toBeInTheDocument();
});

it('Passes ethereum config to children', async () => {
  mockHookValue = {
    ...defaultHookValue,
    isActive: true,
  };
  setup();

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(
    await screen.findByText(
      mockEthereumConfig.collateral_bridge_contract.address
    )
  ).toBeInTheDocument();
});

it('Shows no config found message if the network parameter doesnt exist', async () => {
  const mock: MockedResponse<NetworkParamsQuery> = {
    request: {
      query: NetworkParamsDocument,
    },
    result: {
      data: {
        networkParametersConnection: {
          edges: [
            {
              node: {
                __typename: 'NetworkParameter',
                key: 'nope',
                value: 'foo',
              },
            },
          ],
        },
      },
    },
  };
  setup(mock);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(await screen.findByText('No data')).toBeInTheDocument();
});
