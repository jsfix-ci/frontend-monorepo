import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { KeyValueTable, KeyValueTableRow } from '@vegaprotocol/ui-toolkit';
import type {
  BlockExplorerTransactionResult,
  SubmitOrder,
} from '../../../routes/types/block-explorer-response';
import PartyLink from '../../links/party-link/party-link';
import MarketLink from '../../links/market-link/market-link';

interface TxDetailsOrderProps {
  txData: BlockExplorerTransactionResult | undefined;
  pubKey: string | undefined;
}

/**
 * An order type is probably the most interesting type we'll see! Except until:
 * https://github.com/vegaprotocol/vega/issues/6832 is complete, we can only
 * fetch the actual transaction and not more details about the order. So for now
 * this view is very basic
 */
export const TxDetailsOrder = ({ txData, pubKey }: TxDetailsOrderProps) => {
  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  const cmd = txData.command as SubmitOrder;

  console.dir(cmd);

  return (
    <KeyValueTable>
      <KeyValueTableRow>
        {t('Submitter')}
        {pubKey ? <PartyLink id={pubKey} /> : '-'}
      </KeyValueTableRow>
      <KeyValueTableRow>
        {t('Market')}
        <MarketLink id={cmd.orderSubmission.marketId} />
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
