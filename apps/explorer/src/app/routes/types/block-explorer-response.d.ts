import type { UnknownObject } from '../../components/nested-data-list';

export interface BlockExplorerTransactionResult {
  block: string;
  index: number;
  hash: string;
  submitter: string;
  type: string;
  code: number;
  cursor: string;
  command:
    | ValidatorHeartbeat
    | SubmitOrder
    | StateVariableProposal
    | AmendLiquidityProvisionOrder;
}

export interface BlockExplorerTransactions {
  transactions: BlockExplorerTransactionResult[];
}

export interface BlockExplorerTransaction {
  transaction: BlockExplorerTransactionResult;
}

export interface ValidatorHeartbeat {
  blockHeight: string;
  nonce: string;
  validatorHeartbeat: {
    nodeId: string;
    ethereumSignature: ValidatorHeartbeatSignature;
    vegaSignature: ValidatorHeartbeatSignature;
  };
}

export interface ValidatorHeartbeatSignature {
  algo: string;
  value: string;
  version: number;
}

export interface SubmitOrder {
  orderSubmission: {
    marketId: string;
  };
}

export interface StateVariableProposal {
  proposal: {
    stateVarId: string;
    eventId: string;
    kvb: StateVariableProposalValues[];
  };
}

export interface StateVariableProposalValues {
  key: 'up' | 'down';
  tolerance: string;
  value: UnknownObject;
}

export interface AmendLiquidityProvisionOrder {
  blockHeight: string;
  nonce: string;
  liquidityProvisionAmendment: {
    marketId: string;
    commitmentAmount: string;
    fee: string;
    sells: LiquidityProvisionOrderChange[];
    buys: LiquidityProvisionOrderChange[];
    reference: string;
  };
}

export interface LiquidityProvisionOrderChange {
  string: Reference;
  proportion: number;
  offset: string;
}
