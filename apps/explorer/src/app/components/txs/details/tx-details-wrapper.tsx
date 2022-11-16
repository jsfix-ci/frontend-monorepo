import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { TxDetailsOrder } from './tx-order';
import type { BlockExplorerTransactionResult } from '../../../routes/types/block-explorer-response';
import { TxDetailsHeartbeat } from './tx-hearbeat';

interface TxDetailsWrapperProps {
  txData: BlockExplorerTransactionResult | undefined;
  pubKey: string | undefined;
}

export const TxDetailsWrapper = ({ txData, pubKey }: TxDetailsWrapperProps) => {
  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  let child;

  if (txData.type === 'Submit Order') {
    child = <TxDetailsOrder txData={txData} pubKey={pubKey} />;
  } else if (txData.type === 'Validator Heartbeat') {
    child = <TxDetailsHeartbeat txData={txData} pubKey={pubKey} />;
  } else {
    child = <code>{JSON.stringify(txData)}</code>;
  }

  if (!child) {
    return null;
  }

  return <section>{child}</section>;
};
