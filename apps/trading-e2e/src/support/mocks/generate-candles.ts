import merge from 'lodash/merge';
import type { PartialDeep } from 'type-fest';
import type {
  CandlesQuery,
  CandleFieldsFragment,
} from '@vegaprotocol/candles-chart';

export const generateCandles = (
  override?: PartialDeep<CandlesQuery>
): CandlesQuery => {
  const candles: CandleFieldsFragment[] = [
    {
      periodStart: '2022-04-06T09:15:00Z',
      lastUpdateInPeriod: '2022-04-06T09:16:00Z',
      high: '17481092',
      low: '17403651',
      open: '17458833',
      close: '17446470',
      volume: '82721',
      __typename: 'Candle',
    },
    {
      periodStart: '2022-04-06T09:30:00Z',
      lastUpdateInPeriod: '2022-04-06T09:32:00Z',
      high: '17491202',
      low: '17361138',
      open: '17446470',
      close: '17367174',
      volume: '62637',
      __typename: 'Candle',
    },
    {
      periodStart: '2022-04-06T09:45:00Z',
      lastUpdateInPeriod: '2022-04-06T09:48:00Z',
      high: '17424522',
      low: '17337719',
      open: '17367174',
      close: '17376455',
      volume: '60259',
      __typename: 'Candle',
    },
  ];
  const defaultResult: CandlesQuery = {
    market: {
      id: 'market-0',
      decimalPlaces: 5,
      tradableInstrument: {
        instrument: {
          id: '',
          name: 'Apple Monthly (30 Jun 2022)',
          code: 'AAPL.MF21',
          __typename: 'Instrument',
        },
        __typename: 'TradableInstrument',
      },
      candlesConnection: {
        edges: candles.map((node) => ({
          node,
        })),
      },
      __typename: 'Market',
    },
  };
  return merge(defaultResult, override);
};
