import { Schema as Types } from '@vegaprotocol/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RewardsFieldsFragment = { __typename?: 'RewardEdge', node: { __typename?: 'Reward', rewardType: Types.AccountType, amount: string, amountFormatted: string, percentageOfTotal: string, asset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number }, epoch: { __typename?: 'Epoch', id: string } } };

export type RewardsQueryVariables = Types.Exact<{
  partyId: Types.Scalars['ID'];
}>;


export type RewardsQuery = { __typename?: 'Query', party?: { __typename?: 'Party', id: string, rewardsConnection?: { __typename?: 'RewardsConnection', edges?: Array<{ __typename?: 'RewardEdge', node: { __typename?: 'Reward', rewardType: Types.AccountType, amount: string, amountFormatted: string, percentageOfTotal: string, asset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number }, epoch: { __typename?: 'Epoch', id: string } } } | null> | null } | null } | null, epoch: { __typename?: 'Epoch', id: string, timestamps: { __typename?: 'EpochTimestamps', start?: string | null, end?: string | null, expiry?: string | null } } };

export const RewardsFieldsFragmentDoc = gql`
    fragment RewardsFields on RewardEdge {
  node {
    asset {
      id
      symbol
    }
    rewardType
    asset {
      id
      name
      decimals
    }
    epoch {
      id
    }
    amount
    amountFormatted @client
    percentageOfTotal
  }
}
    `;
export const RewardsDocument = gql`
    query Rewards($partyId: ID!) {
  party(id: $partyId) {
    id
    rewardsConnection {
      edges {
        ...RewardsFields
      }
    }
  }
  epoch {
    id
    timestamps {
      start
      end
      expiry
    }
  }
}
    ${RewardsFieldsFragmentDoc}`;

/**
 * __useRewardsQuery__
 *
 * To run a query within a React component, call `useRewardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRewardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRewardsQuery({
 *   variables: {
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
export function useRewardsQuery(baseOptions: Apollo.QueryHookOptions<RewardsQuery, RewardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RewardsQuery, RewardsQueryVariables>(RewardsDocument, options);
      }
export function useRewardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RewardsQuery, RewardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RewardsQuery, RewardsQueryVariables>(RewardsDocument, options);
        }
export type RewardsQueryHookResult = ReturnType<typeof useRewardsQuery>;
export type RewardsLazyQueryHookResult = ReturnType<typeof useRewardsLazyQuery>;
export type RewardsQueryResult = Apollo.QueryResult<RewardsQuery, RewardsQueryVariables>;