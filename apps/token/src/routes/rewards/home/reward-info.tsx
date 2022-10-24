import React, { forwardRef, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridDynamic as AgGrid } from '@vegaprotocol/ui-toolkit';
import { BigNumber } from '../../../lib/bignumber';
import type {
  RewardsFieldsFragment,
  RewardsQuery,
} from './__generated___/Rewards';
import type { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import { AccountType } from '@vegaprotocol/types';
import { addDecimal, formatNumber } from '@vegaprotocol/react-helpers';

interface RewardInfoProps {
  data: RewardsQuery | undefined;
  currVegaKey: string;
  rewardAssetId: string;
}

export const RewardInfo = ({
  data,
  currVegaKey,
  rewardAssetId,
}: RewardInfoProps) => {
  const { t } = useTranslation();
  if (!data?.party?.rewardsConnection?.edges?.length) {
    return <p>{t('noRewards')}</p>;
  }
  const rewardsByEpoch = Object.entries(
    groupBy(data?.party?.rewardsConnection?.edges, 'epoch.id')
  );
  return (
    <div>
      {rewardsByEpoch.map(([epoch, reward]) => {
        if (!reward) return null;
        return <RewardTable key={epoch} reward={reward} epoch={epoch} />;
      })}
    </div>
  );
};

interface RewardTableProps {
  reward: (RewardsFieldsFragment | null)[];
  epoch: string;
}

const getRewardsByTypes = (
  rewards: RewardsFieldsFragment[],
  types: AccountType[]
) => {
  const filteredResults = rewards.filter(({ node: { rewardType } }) =>
    types.includes(rewardType)
  );
  const total = filteredResults.reduce((acc, cur) => {
    return acc.plus(addDecimal(cur.node.amount, cur.node.asset.decimals));
  }, new BigNumber(0));
  return formatNumber(total);
};

export const RewardTable = ({ reward, epoch }: RewardTableProps) => {
  const { t } = useTranslation();
  const compactRewards = groupBy(compact(reward), 'asset.name');
  const rewardsByAssetAndType = Object.entries(compactRewards).map(
    ([key, value]) => {
      return {
        assetName: key,
        stakingRewards: getRewardsByTypes(value, [
          AccountType.ACCOUNT_TYPE_GLOBAL_REWARD,
          AccountType.ACCOUNT_TYPE_FEES_INFRASTRUCTURE,
        ]),
        priceTaking: getRewardsByTypes(value, [
          AccountType.ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES,
        ]),
        priceMaking: getRewardsByTypes(value, [
          AccountType.ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES,
        ]),
        liquidityProvision: getRewardsByTypes(value, [
          AccountType.ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES,
        ]),
        marketCreation: getRewardsByTypes(value, [
          AccountType.ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS,
        ]),
      };
    }
  );
  const gridRef = useRef<AgGridReact | null>(null);

  const AssetsTable = forwardRef<AgGridReact>((_, ref) => {
    const colDefs = useMemo<ColDef[]>(
      () => [
        {
          field: 'assetName',
          headerName: t('Asset').toString(),
        },
        {
          field: 'stakingRewards',
          headerName: t('Staking').toString(),
        },
        {
          field: 'priceTaking',
          headerName: t('PriceTaking').toString(),
        },
        {
          field: 'priceMaking',
          headerName: t('PriceMaking').toString(),
        },
        {
          field: 'liquidityProvision',
          headerName: t('LiquidityProvision').toString(),
        },
        {
          field: 'marketCreation',
          headerName: t('MarketCreation').toString(),
        },
      ],
      []
    );

    return (
      <div className="mb-24">
        <h3 className="text-lg text-white mb-4">
          {t('Epoch')} {epoch}
        </h3>
        <AgGrid
          domLayout="autoHeight"
          style={{ width: '100%' }}
          overlayNoRowsTemplate={t('noValidators')}
          ref={ref}
          rowData={rewardsByAssetAndType}
          rowHeight={32}
          columnDefs={colDefs}
          // defaultColDef={defaultColDef}
          animateRows={true}
          suppressCellFocus={true}
        />
      </div>
    );
  });

  return <AssetsTable ref={gridRef} />;
};
