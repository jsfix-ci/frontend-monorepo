import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { KeyValueTable, KeyValueTableRow } from '@vegaprotocol/ui-toolkit';
import type {
  BlockExplorerTransactionResult,
  ValidatorHeartbeat,
} from '../../../routes/types/block-explorer-response';

/**
 * Returns an integer representing how fresh the signature is, ranging from 1 to 500.
 * Below 1 should be impossible - you can't sign a block before it is finished
 * Any result about 500 is counted as stale in core and would be bad
 *
 * The precise freshness isn't that important, as long as it is within bounds
 *
 * @param txHeight string Block number that this signature was in
 * @param signatureForHeight string Block number that this signature is signing
 * @returns
 */
export function scoreFreshness(
  txHeight: string,
  signatureForHeight: string
): number {
  const txHeightInt = parseInt(txHeight, 10);
  const signatureForHeightInt = parseInt(signatureForHeight, 10);

  return txHeightInt - signatureForHeightInt;
}

interface TxDetailsHeartbeatProps {
  txData: BlockExplorerTransactionResult | undefined;
  pubKey: string | undefined;
}

/**
 * Validator Heartbeat transactions are a way for non-consensus validators to signal that they
 * are still alive, still following along, and still valid for consideration in the validator set.
 * To indicate they are still alive, they use their Ethereum and Vega private keys to provide two
 * signatures of a recent block on chain.
 *
 * Blocks must be signed within 500 seconds (i.e. roughly 500 blocks) to not be considered stale
 *
 * For the sake of block explorer, these design decisions were made:
 * - The signature values are not interesting. They're available in details but not worth displaying
 * -
 * @param param0
 * @returns
 */
export const TxDetailsHeartbeat = ({
  txData,
  pubKey,
}: TxDetailsHeartbeatProps) => {
  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  const cmd = txData.command as ValidatorHeartbeat;

  return (
    <KeyValueTable>
      <KeyValueTableRow>
        {'Submitter'}
        {pubKey}
      </KeyValueTableRow>
      <KeyValueTableRow>
        {'Node'}
        {cmd.validatorHeartbeat.nodeId}
      </KeyValueTableRow>
      <KeyValueTableRow>
        {'Signature for block'}
        {cmd.blockHeight}
      </KeyValueTableRow>
      <KeyValueTableRow>
        {'Freshness (lower is better)'}
        {scoreFreshness(txData.block, cmd.blockHeight)}
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
