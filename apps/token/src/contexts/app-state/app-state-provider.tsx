import React from 'react';

import { BigNumber } from '../../lib/bignumber';
import { AppStateActionType, AppStateContext } from './app-state-context';
import type { AppState, AppStateAction } from './app-state-context';

interface AppStateProviderProps {
  children: React.ReactNode;
  initialState?: Partial<AppState>;
}

const initialAppState: AppState = {
  // set in app-loader TODO: update when user stakes/unstakes/associates/disassociates
  totalAssociated: new BigNumber(0),
  decimals: 0,
  totalSupply: new BigNumber(0),
  tranches: null,
  vegaWalletOverlay: false,
  vegaWalletManageOverlay: false,
  ethConnectOverlay: false,
  trancheError: null,
  drawerOpen: false,
  transactionOverlay: false,
  bannerMessage: '',
};

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case AppStateActionType.SET_TOKEN: {
      return {
        ...state,
        decimals: action.decimals,
        totalSupply: action.totalSupply,
        totalAssociated: action.totalAssociated,
      };
    }
    case AppStateActionType.SET_TRANCHE_DATA:
      return {
        ...state,
        tranches: action.tranches,
      };
    case AppStateActionType.SET_TRANCHE_ERROR: {
      return {
        ...state,
        trancheError: action.error,
      };
    }
    case AppStateActionType.SET_VEGA_WALLET_OVERLAY: {
      return {
        ...state,
        vegaWalletOverlay: action.isOpen,
        drawerOpen: action.isOpen ? false : state.drawerOpen,
      };
    }
    case AppStateActionType.SET_VEGA_WALLET_MANAGE_OVERLAY: {
      return {
        ...state,
        vegaWalletManageOverlay: action.isOpen,
        vegaWalletOverlay: action.isOpen ? false : state.vegaWalletOverlay,
        drawerOpen: action.isOpen ? false : state.drawerOpen,
      };
    }
    case AppStateActionType.SET_ETH_WALLET_OVERLAY: {
      return {
        ...state,
        ethConnectOverlay: action.isOpen,
        drawerOpen: action.isOpen ? false : state.drawerOpen,
      };
    }
    case AppStateActionType.SET_DRAWER: {
      return {
        ...state,
        drawerOpen: action.isOpen,
        vegaWalletOverlay: false,
      };
    }
    case AppStateActionType.SET_TRANSACTION_OVERLAY: {
      return {
        ...state,
        transactionOverlay: action.isOpen,
      };
    }
    case AppStateActionType.SET_BANNER_MESSAGE: {
      return {
        ...state,
        bannerMessage: action.message,
      };
    }
  }
}

export function AppStateProvider({
  children,
  initialState,
}: AppStateProviderProps) {
  const [state, dispatch] = React.useReducer(appStateReducer, {
    ...initialAppState,
    ...initialState,
  });

  return (
    <AppStateContext.Provider
      value={{
        appState: state,
        appDispatch: dispatch,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
