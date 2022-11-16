import React from 'react';
import { Routes } from '../../../routes/route-names';
import { Link } from 'react-router-dom';

export type BlockLinkProps = {
  height: string;
};

const BlockLink = ({ height }: BlockLinkProps) => {
  return (
    <Link className="underline" to={`/${Routes.BLOCKS}/${height}`}>
      {height}
    </Link>
  );
};

export default BlockLink;
