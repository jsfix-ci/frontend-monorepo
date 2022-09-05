import type { AgGridReact } from 'ag-grid-react';
import {
  addDecimal,
  addDecimalsFormatNumber,
  formatNumber,
  getDateTimeFormat,
  positiveClassNames,
  negativeClassNames,
  t,
} from '@vegaprotocol/react-helpers';
import { Side } from '@vegaprotocol/types';
import { AgGridColumn } from 'ag-grid-react';
import { AgGridDynamic as AgGrid } from '@vegaprotocol/ui-toolkit';
import { forwardRef } from 'react';
import type { ValueFormatterParams } from 'ag-grid-community';
import BigNumber from 'bignumber.js';
import type { AgGridReactProps, AgReactUiProps } from 'ag-grid-react';
import type {
  FillFields,
  FillFields_market_tradableInstrument_instrument_product,
} from './__generated__/FillFields';
import type { Fills_party_tradesConnection_edges_node } from './__generated__/Fills';
import classNames from 'classnames';

export type Props = (AgGridReactProps | AgReactUiProps) & {
  partyId: string;
};

type AccountsTableValueFormatterParams = Omit<
  ValueFormatterParams,
  'data' | 'value'
> & {
  data: Fills_party_tradesConnection_edges_node | null;
};

export const FillsTable = forwardRef<AgGridReact, Props>(
  ({ partyId, ...props }, ref) => {
    return (
      <AgGrid
        ref={ref}
        overlayNoRowsTemplate={t('No fills')}
        defaultColDef={{ flex: 1, resizable: true }}
        style={{ width: '100%', height: '100%' }}
        getRowId={({ data }) => data?.id}
        {...props}
      >
        <AgGridColumn headerName={t('Market')} field="market.name" />
        <AgGridColumn
          headerName={t('Size')}
          type="rightAligned"
          field="size"
          cellClass={({ data }: { data: FillFields }) => {
            return classNames('text-right', {
              [positiveClassNames]: data?.buyer.id === partyId,
              [negativeClassNames]: data?.seller.id,
            });
          }}
          valueFormatter={formatSize(partyId)}
        />
        <AgGridColumn
          headerName={t('Value')}
          field="price"
          valueFormatter={formatPrice}
          type="rightAligned"
        />
        <AgGridColumn
          headerName={t('Filled value')}
          field="price"
          valueFormatter={formatTotal}
          type="rightAligned"
        />
        <AgGridColumn
          headerName={t('Role')}
          field="aggressor"
          valueFormatter={formatRole(partyId)}
        />
        <AgGridColumn
          headerName={t('Fee')}
          field="market.tradableInstrument.instrument.product"
          valueFormatter={formatFee(partyId)}
          type="rightAligned"
        />
        <AgGridColumn
          headerName={t('Date')}
          field="createdAt"
          valueFormatter={({
            value,
          }: AccountsTableValueFormatterParams & {
            value: Fills_party_tradesConnection_edges_node['createdAt'];
          }) => {
            if (value === undefined) {
              return value;
            }
            return getDateTimeFormat().format(new Date(value));
          }}
        />
      </AgGrid>
    );
  }
);

const formatPrice = ({
  value,
  data,
}: AccountsTableValueFormatterParams & {
  value?: Fills_party_tradesConnection_edges_node['price'];
}) => {
  if (value === undefined || !data) {
    return undefined;
  }
  const asset =
    data?.market.tradableInstrument.instrument.product.settlementAsset.symbol;
  const valueFormatted = addDecimalsFormatNumber(
    value,
    data?.market.decimalPlaces
  );
  return `${valueFormatted} ${asset}`;
};

const formatSize = (partyId: string) => {
  return ({
    value,
    data,
  }: AccountsTableValueFormatterParams & {
    value?: Fills_party_tradesConnection_edges_node['size'];
  }) => {
    if (value === undefined || !data) {
      return undefined;
    }
    let prefix;
    if (data?.buyer.id === partyId) {
      prefix = '+';
    } else if (data?.seller.id) {
      prefix = '-';
    }

    const size = addDecimalsFormatNumber(
      value,
      data?.market.positionDecimalPlaces
    );
    return `${prefix}${size}`;
  };
};

const formatTotal = ({
  value,
  data,
}: AccountsTableValueFormatterParams & {
  value?: Fills_party_tradesConnection_edges_node['price'];
}) => {
  if (value === undefined || !data) {
    return undefined;
  }
  const asset =
    data?.market.tradableInstrument.instrument.product.settlementAsset.symbol;
  const size = new BigNumber(
    addDecimal(data?.size, data?.market.positionDecimalPlaces)
  );
  const price = new BigNumber(addDecimal(value, data?.market.decimalPlaces));

  const total = size.times(price).toString();
  const valueFormatted = formatNumber(total, data?.market.decimalPlaces);
  return `${valueFormatted} ${asset}`;
};

const formatRole = (partyId: string) => {
  return ({
    value,
    data,
  }: AccountsTableValueFormatterParams & {
    value?: Fills_party_tradesConnection_edges_node['aggressor'];
  }) => {
    if (value === undefined) {
      return value;
    }
    const taker = t('Taker');
    const maker = t('Maker');
    if (data?.buyer.id === partyId) {
      if (value === Side.SIDE_BUY) {
        return taker;
      } else {
        return maker;
      }
    } else if (data?.seller.id === partyId) {
      if (value === Side.SIDE_SELL) {
        return taker;
      } else {
        return maker;
      }
    } else {
      return '-';
    }
  };
};

const formatFee = (partyId: string) => {
  return ({
    value,
    data,
  }: AccountsTableValueFormatterParams & {
    value?: FillFields_market_tradableInstrument_instrument_product;
  }) => {
    if (value === undefined) {
      return value;
    }
    const asset = value.settlementAsset;
    let feesObj;
    if (data?.buyer.id === partyId) {
      feesObj = data?.buyerFee;
    } else if (data?.seller.id === partyId) {
      feesObj = data?.sellerFee;
    } else {
      return '-';
    }

    const fee = new BigNumber(feesObj.makerFee)
      .plus(feesObj.infrastructureFee)
      .plus(feesObj.liquidityFee);
    const totalFees = addDecimalsFormatNumber(fee.toString(), asset.decimals);
    return `${totalFees} ${asset.symbol}`;
  };
};
