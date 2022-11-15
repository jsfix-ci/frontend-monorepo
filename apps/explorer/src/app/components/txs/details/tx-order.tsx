import React from 'react';
import { sha3_256 } from 'js-sha3';
import { t } from '@vegaprotocol/react-helpers';
import { KeyValueTable, KeyValueTableRow } from '@vegaprotocol/ui-toolkit';
import type { BlockExplorerTransactionResult } from '../../../routes/types/block-explorer-response';

interface TxDetailsOrderProps {
  txData: BlockExplorerTransactionResult | undefined;
  pubKey: string | undefined;
}

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
      <KeyValueTableRow>
        {'Order ID'}
        {sha3_256(txData.hash)}
      </KeyValueTableRow>
      <KeyValueTableRow>
        {'Block'}
        {txData.block}
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
