import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { KeyValueTable, KeyValueTableRow } from '@vegaprotocol/ui-toolkit';
import type {
  BlockExplorerTransactionResult,
  SubmitOrder,
} from '../../../routes/types/block-explorer-response';
import { BlockLink, PartyLink } from '../../links/';
import { MarketLink } from '../../links/';
import type { TendermintBlocksResponse } from '../../../routes/blocks/tendermint-blocks-response';
import { TimeAgo } from '../../time-ago';

interface TxDetailsOrderProps {
  txData: BlockExplorerTransactionResult | undefined;
  pubKey: string | undefined;
  blockData: TendermintBlocksResponse | undefined;
}

/**
 * An order type is probably the most interesting type we'll see! Except until:
 * https://github.com/vegaprotocol/vega/issues/6832 is complete, we can only
 * fetch the actual transaction and not more details about the order. So for now
 * this view is very basic
 */
export const TxDetailsOrder = ({
  txData,
  pubKey,
  blockData,
}: TxDetailsOrderProps) => {
  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  const cmd = txData.command as SubmitOrder;
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
        {t('Market')}
        <MarketLink id={cmd.orderSubmission.marketId} />
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
