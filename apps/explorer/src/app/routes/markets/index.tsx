import React from 'react';
import { SyntaxHighlighter } from '@vegaprotocol/ui-toolkit';
import { RouteTitle } from '../../components/route-title';
import { SubHeading } from '../../components/sub-heading';
import { t } from '@vegaprotocol/react-helpers';
import { useExplorerMarketsQuery } from './__generated__/markets';

const Markets = () => {
  const { data } = useExplorerMarketsQuery();

  const m = data?.marketsConnection?.edges;

  return (
    <section key="markets">
      <RouteTitle data-testid="markets-heading">{t('Markets')}</RouteTitle>

      {m
        ? m.map((e) => (
            <React.Fragment key={e.node.id}>
              <SubHeading data-testid="markets-header">
                {e.node.tradableInstrument.instrument.name}
              </SubHeading>
              <SyntaxHighlighter data={e.node} />
            </React.Fragment>
          ))
        : null}
    </section>
  );
};

export default Markets;
