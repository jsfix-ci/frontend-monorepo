/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PartyAccounts
// ====================================================

export interface PartyAccounts_party_accounts_asset {
  __typename: "Asset";
  /**
   * The id of the asset
   */
  id: string;
  /**
   * The full name of the asset (e.g: Great British Pound)
   */
  name: string;
  /**
   * The precision of the asset
   */
  decimals: number;
}

export interface PartyAccounts_party_accounts {
  __typename: "Account";
  /**
   * Asset, the 'currency'
   */
  asset: PartyAccounts_party_accounts_asset;
  /**
   * Balance as string - current account balance (approx. as balances can be updated several times per second)
   */
  balance: string;
}

export interface PartyAccounts_party {
  __typename: "Party";
  /**
   * Collateral accounts relating to a party
   */
  accounts: PartyAccounts_party_accounts[] | null;
}

export interface PartyAccounts {
  /**
   * An entity that is trading on the VEGA network
   */
  party: PartyAccounts_party | null;
}

export interface PartyAccountsVariables {
  partyId: string;
}
