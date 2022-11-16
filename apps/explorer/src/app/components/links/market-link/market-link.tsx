import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { Routes } from '../../../routes/route-names';
import { useExplorerMarketQuery } from './__generated___/Market';
import { Link } from 'react-router-dom';

export type NodeLinkProps = {
  id: string;
};

const MarketLink = ({ id }: NodeLinkProps) => {
  const { data } = useExplorerMarketQuery({
    variables: { id },
  });

  let label: string = id;

  if (data?.market?.tradableInstrument.instrument.name) {
    label = data.market.tradableInstrument.instrument.name;
  }

  return (
    <Link className="font-bold underline" to={`/${Routes.MARKETS}#${id}`}>
      {label}
    </Link>
  );
};

export default MarketLink;
