import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { KeyValueTable, KeyValueTableRow } from '@vegaprotocol/ui-toolkit';
import type {
  AmendLiquidityProvisionOrder,
  BlockExplorerTransactionResult,
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
 * Specifies changes to the shape of a users Liquidity Commitment order for
 * a specific market
 */
export const TxDetailsLPAmend = ({
  txData,
  pubKey,
  blockData,
}: TxDetailsOrderProps) => {
  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  const cmd = txData.command as AmendLiquidityProvisionOrder;
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
        <MarketLink id={cmd.liquidityProvisionAmendment.marketId} />
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
