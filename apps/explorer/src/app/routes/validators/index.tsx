import { t } from '@vegaprotocol/react-helpers';
import React from 'react';
import { RouteTitle } from '../../components/route-title';
import { SubHeading } from '../../components/sub-heading';
import { SyntaxHighlighter } from '@vegaprotocol/ui-toolkit';
import { DATA_SOURCES } from '../../config';
import { useFetch } from '@vegaprotocol/react-helpers';
import type { TendermintValidatorsResponse } from './tendermint-validator-response';
import { useExplorerNodesQuery } from './__generated__/nodes';

const Validators = () => {
  const {
    state: { data: validators },
  } = useFetch<TendermintValidatorsResponse>(
    `${DATA_SOURCES.tendermintUrl}/validators`
  );
  const { data } = useExplorerNodesQuery();

  return (
    <section>
      <RouteTitle data-testid="validators-header">{t('Validators')}</RouteTitle>
      {data ? (
        <>
          <SubHeading data-testid="vega-header">{t('Vega data')}</SubHeading>
          <SyntaxHighlighter data-testid="vega-data" data={data} />
        </>
      ) : null}
      {validators ? (
        <>
          <SubHeading data-testid="tendermint-header">
            {t('Tendermint data')}
          </SubHeading>
          <SyntaxHighlighter data-testid="tendermint-data" data={validators} />
        </>
      ) : null}
    </section>
  );
};

export default Validators;
