import type { FieldErrors } from 'react-hook-form';
import { useMemo } from 'react';
import { t } from '@vegaprotocol/react-helpers';
import type { Order } from '@vegaprotocol/wallet';
import {
  useVegaWallet,
  VegaWalletOrderTimeInForce as OrderTimeInForce,
  VegaWalletOrderType as OrderType,
} from '@vegaprotocol/wallet';
import { MarketState, MarketTradingMode } from '@vegaprotocol/types';
import type { Market } from '../market';
import { ERROR_SIZE_DECIMAL } from '../utils/validate-size';

export type ValidationProps = {
  step: number;
  market: Market;
  orderType: OrderType;
  orderTimeInForce: OrderTimeInForce;
  fieldErrors?: FieldErrors<Order>;
};

export const useOrderValidation = ({
  step,
  market,
  fieldErrors = {},
  orderType,
  orderTimeInForce,
}: ValidationProps) => {
  const { keypair } = useVegaWallet();

  const invalidText = useMemo(() => {
    if (!keypair) {
      return t('No public key selected');
    }

    if (keypair.tainted) {
      return t('Selected public key has been tainted');
    }

    if (market.state !== MarketState.Active) {
      if (market.state === MarketState.Suspended) {
        return t('Market is currently suspended');
      }

      if (
        market.state === MarketState.Proposed ||
        market.state === MarketState.Pending
      ) {
        return t('Market is not active yet');
      }

      return t('Market is no longer active');
    }

    if (market.tradingMode !== MarketTradingMode.Continuous) {
      if (orderType !== OrderType.Limit) {
        return t('Only limit orders are permitted when market is in auction');
      }

      if (
        [
          OrderTimeInForce.FOK,
          OrderTimeInForce.IOC,
          OrderTimeInForce.GFN,
        ].includes(orderTimeInForce)
      ) {
        return t(
          'Only GTT, GTC and GFA are permitted when market is in auction'
        );
      }
    }

    if (fieldErrors?.size?.type === 'required') {
      return t('An amount needs to be provided');
    }

    if (fieldErrors?.size?.type === 'min') {
      return t(`The amount cannot be lower than "${step}"`);
    }

    if (fieldErrors?.price?.type === 'required') {
      return t('A price needs to be provided');
    }

    if (fieldErrors?.price?.type === 'min') {
      return t(`The price cannot be negative`);
    }

    if (
      fieldErrors?.size?.type === 'validate' &&
      fieldErrors?.size?.message === ERROR_SIZE_DECIMAL
    ) {
      if (market.positionDecimalPlaces === 0) {
        return t('No decimal amounts allowed for this order');
      }
      return t(
        `The amount field only takes up to ${market.positionDecimalPlaces} decimals`
      );
    }

    return '';
  }, [
    keypair,
    step,
    market,
    fieldErrors?.size?.type,
    fieldErrors?.size?.message,
    fieldErrors?.price?.type,
    orderType,
    orderTimeInForce,
  ]);

  return invalidText;
};