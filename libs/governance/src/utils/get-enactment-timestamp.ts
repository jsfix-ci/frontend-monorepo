import { addHours, getTime } from 'date-fns';
import { getClosingTimestamp } from './get-closing-timestamp';

export const getEnactmentTimestamp = (
  proposalVoteDeadline: number,
  enactmentDeadline: number
) => {
  const closingTimestamp = getClosingTimestamp(proposalVoteDeadline);

  return getTime(addHours(closingTimestamp, enactmentDeadline));
};