import { BigNumber } from 'bignumber.js';
import type { OrderSubmissionBody } from '@vegaprotocol/wallet';
import { Side } from '@vegaprotocol/types';
import { addDecimal, removeDecimal } from '@vegaprotocol/react-helpers';
import { useMarketPositions } from './use-market-positions';
import { useMarketData } from './use-market-data';
import type { EstimateOrderQuery } from './__generated__/EstimateOrder';
import { useEstimateOrderQuery } from './__generated__/EstimateOrder';
import type { DealTicketMarketFragment } from '../components/deal-ticket/__generated___/DealTicket';

interface Props {
  order: OrderSubmissionBody['orderSubmission'];
  market: DealTicketMarketFragment;
  partyId: string;
}

const addFees = (feeObj: EstimateOrderQuery['estimateOrder']['fee']) => {
  return new BigNumber(feeObj.makerFee)
    .plus(feeObj.liquidityFee)
    .plus(feeObj.infrastructureFee);
};

export interface OrderMargin {
  margin: string;
  fees: string | null;
}

const useOrderMargin = ({
  order,
  market,
  partyId,
}: Props): OrderMargin | null => {
  const marketPositions = useMarketPositions({ marketId: market.id, partyId });
  const markPriceData = useMarketData(market.id);
  const { data } = useEstimateOrderQuery({
    variables: {
      marketId: market.id,
      partyId,
      price: markPriceData?.market?.data?.markPrice || '',
      size: removeDecimal(
        BigNumber.maximum(
          0,
          new BigNumber(marketPositions?.openVolume || 0)[
            order.side === Side.SIDE_BUY ? 'plus' : 'minus'
          ](order.size)
        ).toString(),
        market.positionDecimalPlaces
      ),
      side: order.side === Side.SIDE_BUY ? Side.SIDE_BUY : Side.SIDE_SELL,
      timeInForce: order.timeInForce,
      type: order.type,
    },
    skip:
      !partyId ||
      !market.id ||
      !order.size ||
      !markPriceData?.market?.data?.markPrice,
  });

  if (data?.estimateOrder.marginLevels.initialLevel) {
    const fees =
      data?.estimateOrder?.fee && addFees(data.estimateOrder.fee).toString();
    return {
      margin: addDecimal(
        BigNumber.maximum(
          0,
          new BigNumber(data.estimateOrder.marginLevels.initialLevel).minus(
            marketPositions?.balance || 0
          )
        ).toString(),
        market.decimalPlaces
      ),
      fees: addDecimal(fees, market.decimalPlaces),
    };
  }
  return null;
};

export default useOrderMargin;
