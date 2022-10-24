import { Schema as Types } from '@vegaprotocol/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TransferFieldsFragment = { __typename?: 'Transfer', id: string, from: string, fromAccountType: Types.AccountType, to: string, toAccountType: Types.AccountType, amount: string, reference?: string | null, status: Types.TransferStatus, timestamp: string, asset?: { __typename?: 'Asset', id: string, symbol: string, decimals: number } | null, kind: { __typename?: 'OneOffTransfer', deliverOn?: string | null } | { __typename?: 'RecurringTransfer', startEpoch: number, endEpoch?: number | null, factor: string, dispatchStrategy?: { __typename?: 'DispatchStrategy', dispatchMetric: Types.DispatchMetric, dispatchMetricAssetId: string, marketIdsInScope?: Array<string> | null } | null } };

export type TransfersQueryVariables = Types.Exact<{
  partyId: Types.Scalars['ID'];
}>;


export type TransfersQuery = { __typename?: 'Query', party?: { __typename?: 'Party', id: string, transfersConnection?: { __typename?: 'TransferConnection', edges?: Array<{ __typename?: 'TransferEdge', node: { __typename?: 'Transfer', id: string, from: string, fromAccountType: Types.AccountType, to: string, toAccountType: Types.AccountType, amount: string, reference?: string | null, status: Types.TransferStatus, timestamp: string, asset?: { __typename?: 'Asset', id: string, symbol: string, decimals: number } | null, kind: { __typename?: 'OneOffTransfer', deliverOn?: string | null } | { __typename?: 'RecurringTransfer', startEpoch: number, endEpoch?: number | null, factor: string, dispatchStrategy?: { __typename?: 'DispatchStrategy', dispatchMetric: Types.DispatchMetric, dispatchMetricAssetId: string, marketIdsInScope?: Array<string> | null } | null } } } | null> | null } | null } | null };

export const TransferFieldsFragmentDoc = gql`
    fragment TransferFields on Transfer {
  id
  from
  fromAccountType
  to
  toAccountType
  asset {
    id
    symbol
    decimals
  }
  amount
  reference
  status
  timestamp
  kind {
    ... on OneOffTransfer {
      deliverOn
    }
    ... on RecurringTransfer {
      startEpoch
      endEpoch
      factor
      dispatchStrategy {
        dispatchMetric
        dispatchMetricAssetId
        marketIdsInScope
      }
    }
  }
}
    `;
export const TransfersDocument = gql`
    query Transfers($partyId: ID!) {
  party(id: $partyId) {
    id
    transfersConnection {
      edges {
        node {
          ...TransferFields
        }
      }
    }
  }
}
    ${TransferFieldsFragmentDoc}`;

/**
 * __useTransfersQuery__
 *
 * To run a query within a React component, call `useTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransfersQuery({
 *   variables: {
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
export function useTransfersQuery(baseOptions: Apollo.QueryHookOptions<TransfersQuery, TransfersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransfersQuery, TransfersQueryVariables>(TransfersDocument, options);
      }
export function useTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransfersQuery, TransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransfersQuery, TransfersQueryVariables>(TransfersDocument, options);
        }
export type TransfersQueryHookResult = ReturnType<typeof useTransfersQuery>;
export type TransfersLazyQueryHookResult = ReturnType<typeof useTransfersLazyQuery>;
export type TransfersQueryResult = Apollo.QueryResult<TransfersQuery, TransfersQueryVariables>;