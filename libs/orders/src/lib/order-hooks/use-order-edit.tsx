import { removeDecimal, toNanoSeconds } from '@vegaprotocol/react-helpers';
import { useState, useCallback } from 'react';
import { useVegaTransaction, useVegaWallet } from '@vegaprotocol/wallet';
import type { Market } from '@vegaprotocol/market-list';
import type { OrderEvent_busEvents_event_Order } from './';
import * as Sentry from '@sentry/react';
import type { Orders_party_ordersConnection_edges_node } from '../components';
import { useOrderEvent } from './use-order-event';

// Can only edit price for now
export interface EditOrderArgs {
  price: string;
}

export const useOrderEdit = (
  order: Orders_party_ordersConnection_edges_node | null,
  market: Market | null
) => {
  const { keypair } = useVegaWallet();

  const [updatedOrder, setUpdatedOrder] =
    useState<OrderEvent_busEvents_event_Order | null>(null);

  const {
    send,
    transaction,
    reset: resetTransaction,
    setComplete,
    Dialog,
  } = useVegaTransaction();

  const waitForOrderEvent = useOrderEvent();

  const reset = useCallback(() => {
    resetTransaction();
    setUpdatedOrder(null);
  }, [resetTransaction]);

  const edit = useCallback(
    async (args: EditOrderArgs) => {
      if (!keypair || !order || !market) {
        return;
      }

      setUpdatedOrder(null);

      try {
        await send({
          pubKey: keypair.pub,
          propagate: true,
          orderAmendment: {
            orderId: order.id,
            marketId: order.market.id,
            price: removeDecimal(args.price, market.decimalPlaces),
            timeInForce: order.timeInForce,
            sizeDelta: 0,
            expiresAt: order.expiresAt
              ? toNanoSeconds(new Date(order.expiresAt)) // Wallet expects timestamp in nanoseconds
              : undefined,
          },
        });

        waitForOrderEvent(order.id, keypair.pub, (updatedOrder) => {
          setUpdatedOrder(updatedOrder);
          setComplete();
        });
      } catch (e) {
        Sentry.captureException(e);
        return;
      }
    },
    [keypair, send, order, market, setComplete, waitForOrderEvent]
  );

  return {
    transaction,
    updatedOrder,
    Dialog,
    edit,
    reset,
  };
};
