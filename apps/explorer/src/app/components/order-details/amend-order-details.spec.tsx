import type { components } from '../../../types/explorer';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import AmendOrderDetails from './amend-order-details';
import { ExplorerDeterministicOrderDocument } from './__generated__/Order';
import { render } from '@testing-library/react';
import { Schema } from '@vegaprotocol/types';

type Amend = components['schemas']['v1OrderAmendment'];

function renderAmendOrderDetails(
  id: string,
  version: number,
  amend: Amend,
  mocks: MockedResponse[]
) {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <AmendOrderDetails version={version} id={id} amend={amend} />
      </MemoryRouter>
    </MockedProvider>
  );
}

function renderExistingAmend(id: string, version: number, amend: Amend) {
  const mocks = {
    request: {
      query: ExplorerDeterministicOrderDocument,
      variables: {
        orderId: '123',
        version: 1
      },
    },
    result: {
      data: {
        orderByID: {
           __typename: 'Order',
          id: '123',
          type: 'GTT',
          status: Schema.OrderStatus.STATUS_ACTIVE,
          version: version,
          createdAt: '123',
          updatedAt: '456',
          expiresAt: '789',
          timeInForce: Schema.OrderTimeInForce.TIME_IN_FORCE_GTC,
          price: '200',
          side: 'BUY',
          remaining: '99',
          rejectionReason: 'rejection',
          reference: '123',
          size: '100',
          party: {
            __typename: 'Party',
            id: '234',
          },
          market: {
            __typename: 'Market',
            id: '789',
            decimalPlaces: '5',
            tradableInstrument: {
              instrument: {
                name: 'test',
              },
            },
          },
        },
      },
    },
  };

  return renderAmendOrderDetails(id, version, amend, [mocks]);
}

describe('Amend order details', () => {
  it('Renders TableRows if all data is provided', async () => {
    const amend: Amend = {
      price: '123',
    };

    const res = renderExistingAmend('123', 1, amend);
    expect(await res.findByText('New price')).toBeInTheDocument();
  });
});
