import compact from 'lodash/compact';
import { AsyncRenderer } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet';
import { AgGridDynamic as AgGrid } from '@vegaprotocol/ui-toolkit';
import type { LedgerEntryFragment } from './__generated___/LedgerEntries';
import { useLedgerEntriesQuery } from './__generated___/LedgerEntries';
import { AgGridColumn } from 'ag-grid-react';
import { useMemo } from 'react';
import {
  fromNanoSeconds,
  getDateTimeFormat,
  toNanoSeconds,
} from '@vegaprotocol/react-helpers';

type Entry = LedgerEntryFragment & {
  id: number;
};

export const LedgerEntries = () => {
  const { pubKey } = useVegaWallet();
  const { data, loading, error } = useLedgerEntriesQuery({
    variables: { partyId: pubKey || '' },
    skip: !pubKey,
  });

  const entries = useMemo<Entry[]>(() => {
    if (!data?.ledgerEntries.edges.length) {
      return [];
    }

    return compact(data.ledgerEntries.edges).map((e, i) => ({
      id: i,
      ...e.node,
    }));
  }, [data]);

  return (
    <AsyncRenderer data={entries} loading={loading} error={error}>
      <Table data={entries} />
    </AsyncRenderer>
  );
};

const Table = ({ data }: { data: Entry[] }) => {
  return (
    <AgGrid
      style={{ width: '100%', height: '100%' }}
      rowData={data}
      getRowId={({ data }) => data.id}
      defaultColDef={{
        flex: 1,
        resizable: true,
      }}
    >
      <AgGridColumn field="accountType" />
      <AgGridColumn field="transferType" />
      <AgGridColumn field="quantity" />
      <AgGridColumn field="assetId" />
      <AgGridColumn field="marketId" />
      <AgGridColumn
        field="vegaTime"
        valueFormatter={({ value }: any) => {
          return getDateTimeFormat().format(fromNanoSeconds(value));
        }}
      />
    </AgGrid>
  );
};
