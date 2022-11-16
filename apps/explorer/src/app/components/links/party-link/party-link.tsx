import React from 'react';
import { Routes } from '../../../routes/route-names';
import { Link } from 'react-router-dom';

export type PartyLinkProps = {
  id: string;
};

const PartyLink = ({ id }: PartyLinkProps) => {
  return (
    <Link className="font-bold underline" to={`/${Routes.PARTIES}/${id}`}>
      {id}
    </Link>
  );
};

export default PartyLink;
