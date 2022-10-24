import { AsyncRenderer } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet';
import { useLedgerEntriesQuery } from './__generated___/LedgerEntries';

export const LedgerEntries = () => {
  const { pubKey } = useVegaWallet();
  const { data, loading, error } = useLedgerEntriesQuery({
    variables: { partyId: pubKey || '' },
    skip: !pubKey,
  });

  return (
    <AsyncRenderer data={data} loading={loading} error={error}>
      <Table data={data} />
    </AsyncRenderer>
  );
};

const Table = ({ data }: any) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
