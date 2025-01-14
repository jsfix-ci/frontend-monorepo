import { makeDataProvider } from '@vegaprotocol/react-helpers';
import type {
  ProposalsListQuery,
  ProposalListFieldsFragment,
} from './__generated___/Proposals';
import { ProposalsListDocument } from './__generated___/Proposals';

const getData = (responseData: ProposalsListQuery) =>
  responseData.proposalsConnection?.edges
    ?.filter((edge) => Boolean(edge?.node))
    .map((edge) => edge?.node as ProposalListFieldsFragment) || null;

export const proposalsListDataProvider = makeDataProvider<
  ProposalsListQuery,
  ProposalListFieldsFragment[],
  never,
  never
>({ query: ProposalsListDocument, getData });
