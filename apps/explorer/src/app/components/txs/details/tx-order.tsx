import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { KeyValueTable, KeyValueTableRow } from '@vegaprotocol/ui-toolkit';
import type { BlockExplorerTransactionResult } from '../../../routes/types/block-explorer-response';

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

  return (
    <KeyValueTable>
      <KeyValueTableRow>
        {'Submitter'}
        {pubKey}
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
