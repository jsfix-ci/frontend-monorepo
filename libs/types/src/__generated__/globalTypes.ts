/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * The various account types in Vega (used by collateral)
 */
export enum AccountType {
  ACCOUNT_TYPE_BOND = "ACCOUNT_TYPE_BOND",
  ACCOUNT_TYPE_EXTERNAL = "ACCOUNT_TYPE_EXTERNAL",
  ACCOUNT_TYPE_FEES_INFRASTRUCTURE = "ACCOUNT_TYPE_FEES_INFRASTRUCTURE",
  ACCOUNT_TYPE_FEES_LIQUIDITY = "ACCOUNT_TYPE_FEES_LIQUIDITY",
  ACCOUNT_TYPE_FEES_MAKER = "ACCOUNT_TYPE_FEES_MAKER",
  ACCOUNT_TYPE_GENERAL = "ACCOUNT_TYPE_GENERAL",
  ACCOUNT_TYPE_GLOBAL_INSURANCE = "ACCOUNT_TYPE_GLOBAL_INSURANCE",
  ACCOUNT_TYPE_GLOBAL_REWARD = "ACCOUNT_TYPE_GLOBAL_REWARD",
  ACCOUNT_TYPE_INSURANCE = "ACCOUNT_TYPE_INSURANCE",
  ACCOUNT_TYPE_MARGIN = "ACCOUNT_TYPE_MARGIN",
  ACCOUNT_TYPE_PENDING_TRANSFERS = "ACCOUNT_TYPE_PENDING_TRANSFERS",
  ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES = "ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES",
  ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES = "ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES",
  ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES = "ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES",
  ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS = "ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS",
  ACCOUNT_TYPE_SETTLEMENT = "ACCOUNT_TYPE_SETTLEMENT",
}

export enum AuctionTrigger {
  AUCTION_TRIGGER_BATCH = "AUCTION_TRIGGER_BATCH",
  AUCTION_TRIGGER_LIQUIDITY = "AUCTION_TRIGGER_LIQUIDITY",
  AUCTION_TRIGGER_OPENING = "AUCTION_TRIGGER_OPENING",
  AUCTION_TRIGGER_PRICE = "AUCTION_TRIGGER_PRICE",
  AUCTION_TRIGGER_UNSPECIFIED = "AUCTION_TRIGGER_UNSPECIFIED",
}

/**
 * Comparator describes the type of comparison.
 */
export enum ConditionOperator {
  OPERATOR_EQUALS = "OPERATOR_EQUALS",
  OPERATOR_GREATER_THAN = "OPERATOR_GREATER_THAN",
  OPERATOR_GREATER_THAN_OR_EQUAL = "OPERATOR_GREATER_THAN_OR_EQUAL",
  OPERATOR_LESS_THAN = "OPERATOR_LESS_THAN",
  OPERATOR_LESS_THAN_OR_EQUAL = "OPERATOR_LESS_THAN_OR_EQUAL",
}

/**
 * Status describe the status of the data spec
 */
export enum DataSourceSpecStatus {
  STATUS_ACTIVE = "STATUS_ACTIVE",
  STATUS_DEACTIVATED = "STATUS_DEACTIVATED",
}

/**
 * The current state of a market
 */
export enum MarketState {
  STATE_ACTIVE = "STATE_ACTIVE",
  STATE_CANCELLED = "STATE_CANCELLED",
  STATE_CLOSED = "STATE_CLOSED",
  STATE_PENDING = "STATE_PENDING",
  STATE_PROPOSED = "STATE_PROPOSED",
  STATE_REJECTED = "STATE_REJECTED",
  STATE_SETTLED = "STATE_SETTLED",
  STATE_SUSPENDED = "STATE_SUSPENDED",
  STATE_TRADING_TERMINATED = "STATE_TRADING_TERMINATED",
}

/**
 * What market trading mode is the market in
 */
export enum MarketTradingMode {
  TRADING_MODE_BATCH_AUCTION = "TRADING_MODE_BATCH_AUCTION",
  TRADING_MODE_CONTINUOUS = "TRADING_MODE_CONTINUOUS",
  TRADING_MODE_MONITORING_AUCTION = "TRADING_MODE_MONITORING_AUCTION",
  TRADING_MODE_NO_TRADING = "TRADING_MODE_NO_TRADING",
  TRADING_MODE_OPENING_AUCTION = "TRADING_MODE_OPENING_AUCTION",
}

/**
 * Validating status of a node, i.e. validator or non-validator
 */
export enum NodeStatus {
  NODE_STATUS_NON_VALIDATOR = "NODE_STATUS_NON_VALIDATOR",
  NODE_STATUS_VALIDATOR = "NODE_STATUS_VALIDATOR",
}

/**
 * Type describes the type of properties that are supported by the data source
 * engine.
 */
export enum PropertyKeyType {
  TYPE_BOOLEAN = "TYPE_BOOLEAN",
  TYPE_DECIMAL = "TYPE_DECIMAL",
  TYPE_EMPTY = "TYPE_EMPTY",
  TYPE_INTEGER = "TYPE_INTEGER",
  TYPE_STRING = "TYPE_STRING",
  TYPE_TIMESTAMP = "TYPE_TIMESTAMP",
}

/**
 * Why the proposal was rejected by the core node
 */
export enum ProposalRejectionReason {
  PROPOSAL_ERROR_CLOSE_TIME_TOO_LATE = "PROPOSAL_ERROR_CLOSE_TIME_TOO_LATE",
  PROPOSAL_ERROR_CLOSE_TIME_TOO_SOON = "PROPOSAL_ERROR_CLOSE_TIME_TOO_SOON",
  PROPOSAL_ERROR_COULD_NOT_INSTANTIATE_MARKET = "PROPOSAL_ERROR_COULD_NOT_INSTANTIATE_MARKET",
  PROPOSAL_ERROR_ENACT_TIME_TOO_LATE = "PROPOSAL_ERROR_ENACT_TIME_TOO_LATE",
  PROPOSAL_ERROR_ENACT_TIME_TOO_SOON = "PROPOSAL_ERROR_ENACT_TIME_TOO_SOON",
  PROPOSAL_ERROR_ERC20_ADDRESS_ALREADY_IN_USE = "PROPOSAL_ERROR_ERC20_ADDRESS_ALREADY_IN_USE",
  PROPOSAL_ERROR_INCOMPATIBLE_TIMESTAMPS = "PROPOSAL_ERROR_INCOMPATIBLE_TIMESTAMPS",
  PROPOSAL_ERROR_INSUFFICIENT_EQUITY_LIKE_SHARE = "PROPOSAL_ERROR_INSUFFICIENT_EQUITY_LIKE_SHARE",
  PROPOSAL_ERROR_INSUFFICIENT_TOKENS = "PROPOSAL_ERROR_INSUFFICIENT_TOKENS",
  PROPOSAL_ERROR_INVALID_ASSET = "PROPOSAL_ERROR_INVALID_ASSET",
  PROPOSAL_ERROR_INVALID_ASSET_DETAILS = "PROPOSAL_ERROR_INVALID_ASSET_DETAILS",
  PROPOSAL_ERROR_INVALID_FEE_AMOUNT = "PROPOSAL_ERROR_INVALID_FEE_AMOUNT",
  PROPOSAL_ERROR_INVALID_FREEFORM = "PROPOSAL_ERROR_INVALID_FREEFORM",
  PROPOSAL_ERROR_INVALID_FUTURE_PRODUCT = "PROPOSAL_ERROR_INVALID_FUTURE_PRODUCT",
  PROPOSAL_ERROR_INVALID_INSTRUMENT_SECURITY = "PROPOSAL_ERROR_INVALID_INSTRUMENT_SECURITY",
  PROPOSAL_ERROR_INVALID_MARKET = "PROPOSAL_ERROR_INVALID_MARKET",
  PROPOSAL_ERROR_INVALID_RISK_PARAMETER = "PROPOSAL_ERROR_INVALID_RISK_PARAMETER",
  PROPOSAL_ERROR_INVALID_SHAPE = "PROPOSAL_ERROR_INVALID_SHAPE",
  PROPOSAL_ERROR_MAJORITY_THRESHOLD_NOT_REACHED = "PROPOSAL_ERROR_MAJORITY_THRESHOLD_NOT_REACHED",
  PROPOSAL_ERROR_MARKET_MISSING_LIQUIDITY_COMMITMENT = "PROPOSAL_ERROR_MARKET_MISSING_LIQUIDITY_COMMITMENT",
  PROPOSAL_ERROR_MISSING_BUILTIN_ASSET_FIELD = "PROPOSAL_ERROR_MISSING_BUILTIN_ASSET_FIELD",
  PROPOSAL_ERROR_MISSING_COMMITMENT_AMOUNT = "PROPOSAL_ERROR_MISSING_COMMITMENT_AMOUNT",
  PROPOSAL_ERROR_MISSING_ERC20_CONTRACT_ADDRESS = "PROPOSAL_ERROR_MISSING_ERC20_CONTRACT_ADDRESS",
  PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_KEY = "PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_KEY",
  PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_VALUE = "PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_VALUE",
  PROPOSAL_ERROR_NETWORK_PARAMETER_VALIDATION_FAILED = "PROPOSAL_ERROR_NETWORK_PARAMETER_VALIDATION_FAILED",
  PROPOSAL_ERROR_NODE_VALIDATION_FAILED = "PROPOSAL_ERROR_NODE_VALIDATION_FAILED",
  PROPOSAL_ERROR_NO_PRODUCT = "PROPOSAL_ERROR_NO_PRODUCT",
  PROPOSAL_ERROR_NO_RISK_PARAMETERS = "PROPOSAL_ERROR_NO_RISK_PARAMETERS",
  PROPOSAL_ERROR_NO_TRADING_MODE = "PROPOSAL_ERROR_NO_TRADING_MODE",
  PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_LARGE = "PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_LARGE",
  PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_SMALL = "PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_SMALL",
  PROPOSAL_ERROR_PARTICIPATION_THRESHOLD_NOT_REACHED = "PROPOSAL_ERROR_PARTICIPATION_THRESHOLD_NOT_REACHED",
  PROPOSAL_ERROR_TOO_MANY_MARKET_DECIMAL_PLACES = "PROPOSAL_ERROR_TOO_MANY_MARKET_DECIMAL_PLACES",
  PROPOSAL_ERROR_TOO_MANY_PRICE_MONITORING_TRIGGERS = "PROPOSAL_ERROR_TOO_MANY_PRICE_MONITORING_TRIGGERS",
  PROPOSAL_ERROR_UNKNOWN_RISK_PARAMETER_TYPE = "PROPOSAL_ERROR_UNKNOWN_RISK_PARAMETER_TYPE",
  PROPOSAL_ERROR_UNKNOWN_TYPE = "PROPOSAL_ERROR_UNKNOWN_TYPE",
  PROPOSAL_ERROR_UNSUPPORTED_PRODUCT = "PROPOSAL_ERROR_UNSUPPORTED_PRODUCT",
  PROPOSAL_ERROR_UNSUPPORTED_TRADING_MODE = "PROPOSAL_ERROR_UNSUPPORTED_TRADING_MODE",
}

/**
 * Various states a proposal can transition through:
 * Open ->
 * - Passed -> Enacted.
 * - Rejected.
 * Proposal can enter Failed state from any other state.
 */
export enum ProposalState {
  STATE_DECLINED = "STATE_DECLINED",
  STATE_ENACTED = "STATE_ENACTED",
  STATE_FAILED = "STATE_FAILED",
  STATE_OPEN = "STATE_OPEN",
  STATE_PASSED = "STATE_PASSED",
  STATE_REJECTED = "STATE_REJECTED",
  STATE_WAITING_FOR_NODE_VOTE = "STATE_WAITING_FOR_NODE_VOTE",
}

/**
 * The status of the stake linking
 */
export enum StakeLinkingStatus {
  STATUS_ACCEPTED = "STATUS_ACCEPTED",
  STATUS_PENDING = "STATUS_PENDING",
  STATUS_REJECTED = "STATUS_REJECTED",
}

export enum VoteValue {
  VALUE_NO = "VALUE_NO",
  VALUE_YES = "VALUE_YES",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
