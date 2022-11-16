import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { KeyValueTable, KeyValueTableRow } from '@vegaprotocol/ui-toolkit';
import type {
  BlockExplorerTransactionResult,
  ValidatorHeartbeat,
} from '../../../routes/types/block-explorer-response';
import { BlockLink, NodeLink, PartyLink } from '../../links/';
import type { TendermintBlocksResponse } from '../../../routes/blocks/tendermint-blocks-response';
import { TimeAgo } from '../../time-ago';
import { Block } from '../../../routes/blocks/id';

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
  blockData: TendermintBlocksResponse | undefined;
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
 * - Freshness is a word that isn't used anywhere else. It's meant to imply how close to the lower
 *   bound the signature was. But it doesn't matter as long as it's less than 500.
 * @param param0
 * @returns
 */
export const TxDetailsHeartbeat = ({
  txData,
  pubKey,
  blockData,
}: TxDetailsHeartbeatProps) => {
  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  const cmd = txData.command as ValidatorHeartbeat;
  const time: string = blockData?.result.block.header.time || '';
  const height: string = blockData?.result.block.header.height || '';

  return (
    <KeyValueTable>
      <KeyValueTableRow>
        {t('Submitter')}
        {pubKey ? <PartyLink id={pubKey} /> : '-'}
      </KeyValueTableRow>
      <KeyValueTableRow>
        {t('Block')}
        <BlockLink height={height} />
      </KeyValueTableRow>
      <KeyValueTableRow>
        {t('Time')}
        {time ? (
          <span>
            {time} (<TimeAgo date={time} /> )
          </span>
        ) : (
          '-'
        )}
      </KeyValueTableRow>
      <KeyValueTableRow>
        {t('Node')}
        <NodeLink id={cmd.validatorHeartbeat.nodeId} />
      </KeyValueTableRow>
      <KeyValueTableRow>
        {t('Signed block height')}
        <BlockLink height={cmd.blockHeight} />
      </KeyValueTableRow>
      <KeyValueTableRow>
        {t('Freshness (lower is better)')}
        {scoreFreshness(txData.block, cmd.blockHeight)}
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
