import { AsyncRenderer } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet';
import { useTransfersQuery } from './__generated___/Transfers';

export const Transfers = () => {
  const { pubKey } = useVegaWallet();
  const { data, loading, error } = useTransfersQuery({
    variables: { partyId: pubKey || '' },
    skip: !pubKey,
  });
  console.log(data);
  return (
    <AsyncRenderer data={data} loading={loading} error={error}>
      <Table data={data} />
    </AsyncRenderer>
  );
};

const Table = ({ data }: { data: any }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
