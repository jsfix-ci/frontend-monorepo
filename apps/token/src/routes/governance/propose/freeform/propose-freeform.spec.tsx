import { render, screen, waitFor } from '@testing-library/react';
import { ProposeFreeform } from './propose-freeform';
import { MockedProvider } from '@apollo/client/testing';
import { mockWalletContext } from '../../test-helpers/mocks';
import { AppStateProvider } from '../../../../contexts/app-state/app-state-provider';
import { VegaWalletContext } from '@vegaprotocol/wallet';
import { MemoryRouter as Router } from 'react-router-dom';
import { gql } from '@apollo/client';
import type { NetworkParamsQuery } from '@vegaprotocol/web3';
import type { MockedResponse } from '@apollo/client/testing';

jest.mock('@vegaprotocol/environment', () => ({
  useEnvironment: () => ({
    VEGA_DOCS_URL: 'https://docs.vega.xyz',
  }),
}));

const updateMarketNetworkParamsQueryMock: MockedResponse<NetworkParamsQuery> = {
  request: {
    query: gql`
      query NetworkParams {
        networkParameters {
          key
          value
        }
      }
    `,
  },
  result: {
    data: {
      networkParameters: [
        {
          __typename: 'NetworkParameter',
          key: 'governance.proposal.freeform.maxClose',
          value: '8760h0m0s',
        },
        {
          __typename: 'NetworkParameter',
          key: 'governance.proposal.freeform.maxEnact',
          value: '8760h0m0s',
        },
        {
          __typename: 'NetworkParameter',
          key: 'governance.proposal.freeform.minClose',
          value: '1h0m0s',
        },
        {
          __typename: 'NetworkParameter',
          key: 'governance.proposal.freeform.minEnact',
          value: '2h0m0s',
        },
        {
          __typename: 'NetworkParameter',
          key: 'governance.proposal.freeform.minProposerBalance',
          value: '1',
        },
        {
          __typename: 'NetworkParameter',
          key: 'spam.protection.proposal.min.tokens',
          value: '1000000000000000000',
        },
      ],
    },
  },
};

const renderComponent = () =>
  render(
    <Router>
      <MockedProvider mocks={[updateMarketNetworkParamsQueryMock]}>
        <AppStateProvider>
          <VegaWalletContext.Provider value={mockWalletContext}>
            <ProposeFreeform />
          </VegaWalletContext.Provider>
        </AppStateProvider>
      </MockedProvider>
    </Router>
  );

// Note: form submission is tested in propose-raw.spec.tsx. Reusable form
// components are tested in their own directory.

describe('Propose Freeform', () => {
  it('should render successfully', async () => {
    const { baseElement } = renderComponent();
    expect(baseElement).toBeTruthy();
  });

  it('should render the title', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText('New freeform proposal')).toBeInTheDocument()
    );
  });

  it('should render the form components', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByTestId('freeform-proposal-form')).toBeTruthy()
    );
    expect(screen.getByTestId('min-proposal-requirements')).toBeTruthy();
    expect(screen.getByTestId('proposal-docs-link')).toBeTruthy();
    expect(screen.getByTestId('proposal-title')).toBeTruthy();
    expect(screen.getByTestId('proposal-description')).toBeTruthy();
    expect(screen.getByTestId('proposal-vote-deadline')).toBeTruthy();
    expect(screen.getByTestId('proposal-submit')).toBeTruthy();
    expect(screen.getByTestId('proposal-transaction-dialog')).toBeTruthy();
  });
});