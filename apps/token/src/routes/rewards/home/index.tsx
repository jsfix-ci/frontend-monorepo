import { useQuery } from '@apollo/client';
import { Callout, Intent, Splash } from '@vegaprotocol/ui-toolkit';
import { formatDistance } from 'date-fns';
// @ts-ignore No types available for duration-js
import Duration from 'duration-js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EpochCountdown } from '../../../components/epoch-countdown';
import { Heading } from '../../../components/heading';
import { SplashLoader } from '../../../components/splash-loader';
import { RewardInfo } from './reward-info';
import { useVegaWallet } from '@vegaprotocol/wallet';
import { useNetworkParams, NetworkParams } from '@vegaprotocol/react-helpers';
import { VegaWalletContainer } from '../../../components/vega-wallet-container';
import { RewardsDocument } from './__generated___/Rewards';
import type { RewardsQuery } from './__generated___/Rewards';

export const RewardsIndex = () => {
  const { t } = useTranslation();
  const { pubKey } = useVegaWallet();
  const { data, loading, error } = useQuery<RewardsQuery>(RewardsDocument, {
    variables: { partyId: pubKey },
    skip: !pubKey,
  });
  const { params } = useNetworkParams([
    NetworkParams.reward_asset,
    NetworkParams.reward_staking_delegation_payoutDelay,
  ]);

  const payoutDuration = React.useMemo(() => {
    if (!params) {
      return 0;
    }
    return new Duration(
      params.reward_staking_delegation_payoutDelay
    ).milliseconds();
  }, [params]);

  if (error) {
    return (
      <section>
        <p>{t('Something went wrong')}</p>
        {error && <pre>{error.message}</pre>}
      </section>
    );
  }

  if (loading || !params) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    );
  }

  return (
    <section className="rewards">
      <Heading title={t('pageTitleRewards')} />
      <p>
        {t('rewardsPara', {
          duration: payoutDuration
            ? formatDistance(new Date(0), payoutDuration)
            : t('immediately'),
        })}
      </p>
      {!loading &&
        data &&
        !error &&
        data.epoch.timestamps.start &&
        data.epoch.timestamps.expiry && (
          <section className="mb-8">
            <EpochCountdown
              // eslint-disable-next-line
              id={data!.epoch.id}
              startDate={new Date(data.epoch.timestamps.start)}
              // eslint-disable-next-line
              endDate={new Date(data.epoch.timestamps.expiry!)}
            />
          </section>
        )}
      <section>
        <VegaWalletContainer
          render={(pubKey) => (
            <RewardInfo
              currVegaKey={pubKey}
              data={data}
              rewardAssetId={params.reward_asset}
            />
          )}
        />
      </section>
    </section>
  );
};
