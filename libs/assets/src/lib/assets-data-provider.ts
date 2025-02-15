import {
  makeDataProvider,
  makeDerivedDataProvider,
  useDataProvider,
} from '@vegaprotocol/react-helpers';
import { AssetsDocument } from './__generated__/Assets';
import { Schema } from '@vegaprotocol/types';
import type { AssetsQuery } from './__generated__/Assets';
import type { Asset } from './asset-data-provider';

export interface ERC20AssetSource {
  __typename: 'ERC20';
  contractAddress: string;
  lifetimeLimit: string;
  withdrawThreshold: string;
}

export interface BuiltinAssetSource {
  __typename: 'BuiltinAsset';
}

export type ERC20Asset = Omit<Asset, 'source'> & {
  source: ERC20AssetSource;
};

export type BuiltinAsset = Omit<Asset, 'source'> & {
  source: BuiltinAssetSource;
};

export const isAssetTypeERC20 = (
  asset?: Pick<Asset, 'source'>
): asset is ERC20Asset => {
  if (!asset?.source) return false;
  return asset.source.__typename === 'ERC20';
};

const getData = (responseData: AssetsQuery) =>
  responseData.assetsConnection?.edges
    ?.filter((e) => Boolean(e?.node))
    .map((e) => e?.node as Asset) ?? [];

export const assetsProvider = makeDataProvider<
  AssetsQuery,
  Asset[] | null,
  never,
  never
>({
  query: AssetsDocument,
  getData,
});

export const enabledAssetsProvider = makeDerivedDataProvider<
  ReturnType<typeof getData>,
  never
>([assetsProvider], ([assets]) =>
  (assets as ReturnType<typeof getData>).filter(
    (a) => a.status === Schema.AssetStatus.STATUS_ENABLED
  )
);

export const useAssetsDataProvider = () =>
  useDataProvider({
    dataProvider: assetsProvider,
  });
