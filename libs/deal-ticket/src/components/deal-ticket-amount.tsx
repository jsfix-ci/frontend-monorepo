import type { UseFormRegister } from 'react-hook-form';
import { VegaWalletOrderType } from '@vegaprotocol/wallet';
import { DealTicketMarketAmount } from './deal-ticket-market-amount';
import { DealTicketLimitAmount } from './deal-ticket-limit-amount';
import type { OrderSubmitInput } from '@vegaprotocol/orders';

export interface DealTicketAmountProps {
  orderType: VegaWalletOrderType;
  step: number;
  register: UseFormRegister<OrderSubmitInput>;
  quoteName: string;
  price?: string;
}

export const DealTicketAmount = ({
  orderType,
  ...props
}: DealTicketAmountProps) => {
  switch (orderType) {
    case VegaWalletOrderType.Market:
      return <DealTicketMarketAmount {...props} />;
    case VegaWalletOrderType.Limit:
      return <DealTicketLimitAmount {...props} />;
    default: {
      throw new Error('Invalid ticket type');
    }
  }
};
