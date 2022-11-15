import { Routes } from '../../route-names';
import { t } from '@vegaprotocol/react-helpers';
import type { BlockExplorerTransactionResult } from '../../../routes/types/block-explorer-response';
import React from 'react';
import { TruncateInline } from '../../../components/truncate/truncate';
import { Link } from 'react-router-dom';
import { TxDetailsOrder } from '../../../components/txs/details/tx-order';

interface TxDetailsProps {
  txData: BlockExplorerTransactionResult | undefined;
  pubKey: string | undefined;
  className?: string;
}

export const txDetailsTruncateLength = 30;

export const TxDetails = ({ txData, pubKey, className }: TxDetailsProps) => {
  if (!txData) {
    return <>{t('Awaiting Block Explorer transaction details')}</>;
  }

  const truncatedSubmitter = (
    <TruncateInline text={pubKey || ''} startChars={5} endChars={5} />
  );

  return (
    <section className="mb-10">
      <h3 className="text-l xl:text-l uppercase mb-4">
        {txData.type} by{' '}
        <Link
          className="font-bold underline"
          to={`/${Routes.PARTIES}/${pubKey}`}
        >
          {truncatedSubmitter}
        </Link>
      </h3>
      <TxDetailsOrder txData={txData} pubKey={pubKey} />
      <p className="text-m xl:text-m uppercase font-alpha">
        Block{' '}
        <Link
          className="font-bold underline"
          to={`/${Routes.BLOCKS}/${txData.block}`}
        >
        </Link>
        {', '}
        Index {txData.index}
      </p>
    </section>
  );
};
