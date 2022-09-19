import type { CSSProperties } from 'react';
import { forwardRef } from 'react';
import type {
  CellRendererSelectorResult,
  GroupCellRendererParams,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import {
  PriceCell,
  addDecimalsFormatNumber,
  t,
  formatNumberPercentage,
} from '@vegaprotocol/react-helpers';
import { Intent } from '@vegaprotocol/ui-toolkit';
import { AgGridDynamic as AgGrid, ProgressBar } from '@vegaprotocol/ui-toolkit';
import { AgGridColumn } from 'ag-grid-react';
import type { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import type { AccountFieldsFragment } from './__generated__/Accounts';
import { getId } from './accounts-data-provider';
import { useAssetDetailsDialogStore } from '@vegaprotocol/assets';
import type { AccountFields } from './accounts-manager';
import BigNumber from 'bignumber.js';

export interface ValueProps {
  valueFormatted?: {
    low: string;
    high: string;
    percentage: string;
    value: number;
    intent?: Intent;
  };
}

export const EmptyCell = () => '';

export const ProgressBarCell = ({ valueFormatted }: ValueProps) => {
  return valueFormatted ? (
    <>
      <div className="flex justify-between leading-tight font-mono">
        <div>{valueFormatted.low}</div>
        <div>
          {valueFormatted.high} ({valueFormatted.percentage})
        </div>
      </div>
      <ProgressBar
        value={valueFormatted.value}
        intent={valueFormatted.intent}
        className="mt-2"
      />
    </>
  ) : null;
};

export const progressBarValueFormatter = ({
  data,
  node,
}: ValueFormatterParams): ValueProps['valueFormatted'] | undefined => {
  if (!data || node?.rowPinned) {
    return undefined;
  }
  const min = new BigNumber(data.used);
  const max = new BigNumber(data.deposited);
  const mid = max.minus(min);
  const range = max;
  const value = range ? min.times(100).dividedBy(range || 1) : new BigNumber(0);
  return {
    low: addDecimalsFormatNumber(min.toString(), data.asset.decimals),
    high: addDecimalsFormatNumber(mid.toString(), data.asset.decimals),
    value: value.toNumber(),
    intent: Intent.None,
    percentage: value ? formatNumberPercentage(value, 2) : '0.00',
  };
};

export const progressBarHeaderComponentParams = {
  template:
    '<div class="ag-cell-label-container" role="presentation">' +
    `  <span>${t('Available')}</span>` +
    '  <span ref="eText" class="ag-header-cell-text"></span>' +
    '</div>',
};

export const progressBarCellRendererSelector = (
  params: ICellRendererParams
): CellRendererSelectorResult => {
  return {
    component: params.node.rowPinned ? EmptyCell : ProgressBarCell,
  };
};

interface AccountsTableProps extends AgGridReactProps {
  data: AccountFields[] | null;
  style?: CSSProperties;
}

interface AccountsTableValueFormatterParams extends ValueFormatterParams {
  data: AccountFieldsFragment;
}

export const assetDecimalsFormatter = ({
  value,
  data,
}: AccountsTableValueFormatterParams) =>
  addDecimalsFormatNumber(value, data.asset.decimals);

export const AccountsTable = forwardRef<AgGridReact, AccountsTableProps>(
  ({ data }, ref) => {
    const { setAssetDetailsDialogOpen, setAssetDetailsDialogSymbol } =
      useAssetDetailsDialogStore();
    const assetDialogCellRenderer = ({ value }: GroupCellRendererParams) =>
      value && value.length > 0 ? (
        <button
          className="hover:underline"
          onClick={() => {
            setAssetDetailsDialogOpen(true);
            setAssetDetailsDialogSymbol(value);
          }}
        >
          {value}
        </button>
      ) : (
        ''
      );
    console.log('data', data);
    return (
      <AgGrid
        style={{ width: '100%', height: '100%' }}
        overlayNoRowsTemplate={t('No accounts')}
        rowData={data}
        getRowId={({ data }) => getId(data)}
        ref={ref}
        rowHeight={34}
        components={{ PriceCell }}
        tooltipShowDelay={500}
        defaultColDef={{
          flex: 1,
          resizable: true,
        }}
      >
        <AgGridColumn
          headerName={t('Asset')}
          field="asset.symbol"
          headerTooltip={t(
            'Asset is the collateral that is deposited into the Vega protocol.'
          )}
          cellRenderer={assetDialogCellRenderer}
        />
        <AgGridColumn
          headerName={t('Used')}
          field="used"
          flex={2}
          headerComponentParams={progressBarHeaderComponentParams}
          cellRendererSelector={progressBarCellRendererSelector}
          valueFormatter={progressBarValueFormatter}
        />
        <AgGridColumn
          headerName={t('Deposited')}
          field="deposited"
          valueFormatter={assetDecimalsFormatter}
        />
        <AgGridColumn
          headerName={t('Market')}
          field="market.tradableInstrument.instrument.name"
          valueFormatter="value || '—'"
        />
      </AgGrid>
    );
  }
);

export default AccountsTable;
