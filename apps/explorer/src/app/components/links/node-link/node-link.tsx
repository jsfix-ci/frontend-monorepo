import React from 'react';
import { t } from '@vegaprotocol/react-helpers';
import { Routes } from '../../../routes/route-names';
import { useExplorerNodeQuery } from './__generated___/Node';
import { Link } from 'react-router-dom';

export type NodeLinkProps = {
  id: string;
};

const NodeLink = ({ id }: NodeLinkProps) => {
  const { data } = useExplorerNodeQuery({
    variables: { id },
  });

  let label: string = id;

  if (data?.node?.name) {
    label = data.node.name;
  }

  return (
    <Link className="font-bold underline" to={`/${Routes.VALIDATORS}#${id}`}>
      {label}
    </Link>
  );
};

export default NodeLink;
