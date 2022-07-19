import type { Story, Meta } from '@storybook/react';
import { OrderList, OrderListTable } from './order-list';
import { useState } from 'react';
import type { VegaTxState } from '@vegaprotocol/wallet';
import { VegaTransactionDialog, VegaTxStatus } from '@vegaprotocol/wallet';
import { generateOrdersArray } from '../mocks';

export default {
  component: OrderList,
  title: 'OrderList',
} as Meta;

const Template: Story = (args) => {
  const cancel = () => Promise.resolve();
  return (
    <div style={{ height: 1000 }}>
      <OrderListTable
        rowData={args.data}
        cancel={cancel}
        setEditOrder={() => {
          return;
        }}
      />
    </div>
  );
};

const Template2: Story = (args) => {
  const [open, setOpen] = useState(false);
  const cancel = () => {
    setOpen(!open);
    return Promise.resolve();
  };
  const transaction: VegaTxState = {
    status: VegaTxStatus.Default,
    error: null,
    txHash: null,
    signature: null,
  };

  return (
    <>
      <div style={{ height: 1000 }}>
        <OrderListTable
          rowData={args.data}
          cancel={cancel}
          setEditOrder={() => {
            return;
          }}
        />
      </div>
      <VegaTransactionDialog
        isOpen={open}
        onChange={setOpen}
        transaction={transaction}
        title={'Order cancelled'}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  data: generateOrdersArray(),
};

export const Modal = Template2.bind({});
Modal.args = {
  data: generateOrdersArray(),
};
