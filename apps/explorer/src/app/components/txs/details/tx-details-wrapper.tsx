import React from 'react';
import { DATA_SOURCES } from '../../../config';
import { t, useFetch } from '@vegaprotocol/react-helpers';
import { TxDetailsOrder } from './tx-order';
import type { BlockExplorerTransactionResult } from '../../../routes/types/block-explorer-response';
import type { TendermintBlocksResponse } from '../../../routes/blocks/tendermint-blocks-response';
import { TxDetailsHeartbeat } from './tx-hearbeat';

interface TxDetailsWrapperProps {
  txData: BlockExplorerTransactionResult | undefined;
  pubKey: string | undefined;
  height: string;
}

export const TxDetailsWrapper = ({
  txData,
  pubKey,
  height,
}: TxDetailsWrapperProps) => {
  const {
    state: { data: blockData, loading, error },
  } = useFetch<TendermintBlocksResponse>(
    `${DATA_SOURCES.tendermintUrl}/block?height=${height}`
  );

  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  let child;

  if (txData.type === 'Submit Order') {
    child = (
      <TxDetailsOrder txData={txData} blockData={blockData} pubKey={pubKey} />
    );
  } else if (txData.type === 'Validator Heartbeat') {
    child = (
      <TxDetailsHeartbeat
        txData={txData}
        blockData={blockData}
        pubKey={pubKey}
      />
    );
  } else {
    child = <code>{JSON.stringify(txData)}</code>;
  }

  if (!child) {
    return null;
  }

  return <section>{child}</section>;
};
