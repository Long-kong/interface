import { Percent } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const CONTRACT_ADDRESS = '0xa47bDB758c729be848170094adb88118deFc6468' //TODO: change address
export const PAIR_WETH_USDT = '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852'
export const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7'
export const UNISWAP_V2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
export const PAIR_WETH_KONG = '0x1e55155174c4030BE9A4EC2B64E23145aC6A7Ee9' //TODO: change address

export const UNTRADEABLE_TOKEN = 'KONG'
// TODO(WEB-1984): Convert the deadline to minutes and remove unecessary conversions from
// seconds to minutes in the codebase.
// 10 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 10
export const L2_DEADLINE_FROM_NOW = 60 * 5

export const SWAP_CONTRACT_ABI = [
  'function addLiquidity ( address tokenA, address tokenB, uint256 amountTokenDesired, uint256 amountWETHDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline ) external returns ( uint256 amountA, uint256 amountB, uint256 liquidity )',
  'function addLiquidityETH ( address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline ) external returns ( uint256 amountA, uint256 amountB, uint256 liquidity )',
  'function affiliateIndex ( uint256 ) external view returns ( address )',
  'function affiliatePercentage (  ) external view returns ( uint256 )',
  'function affiliateStartTimestamp ( address ) external view returns ( uint256 )',
  'function affiliates ( address ) external view returns ( address )',
  'function affiliatesEarnings ( address ) external view returns ( uint256 )',
  'function allowance ( address owner, address spender ) external view returns ( uint256 )',
  'function approve ( address spender, uint256 amount ) external returns ( bool )',
  'function balanceOf ( address account ) external view returns ( uint256 )',
  'function bonuses ( address, uint256 ) external view returns ( uint256 )',
  'function bootstrapTimestampEnd (  ) external view returns ( uint256 )',
  'function createPairAndRenounce (  ) external',
  'function currentCycleStats() external view returns (tuple(uint index, address topAffiliate, uint topAffiliateEarnings, address topBuyer, uint topTotalBuyAmount))',
  'function cycleAffiliateEarnings( address, uint256 ) external view returns ( uint256 )',
  'function cycleBuys( address, uint256 ) external view returns ( uint256 )',
  'function cycleWinners(uint) external view returns (tuple(address topAffiliate, uint topAffiliateEarnings, uint affiliatePrize, address topBuyer, uint topTotalBuyAmount,uint buyerPrize))',
  'function globalAffiliateEarnings( address ) external view returns ( uint256 )',
  'function decimals (  ) external view returns ( uint8 )',
  'function decreaseAllowance ( address spender, uint256 subtractedValue ) external returns ( bool )',
  'function deploymentTimestamp (  ) external view returns ( uint256 )',
  'function factory (  ) external view returns ( address )',
  'function getCycle (  ) external view returns ( uint256 )',
  'function inBootstrap (  ) external view returns ( bool )',
  'function increaseAllowance ( address spender, uint256 addedValue ) external returns ( bool )',
  'function mappingIndex (  ) external view returns ( uint256 )',
  'function maxPercentage (  ) external view returns ( uint256 )',
  'function name (  ) external view returns ( string )',
  'function owner (  ) external view returns ( address )',
  'function pair (  ) external view returns ( address )',
  'function removeLiquidity ( address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline ) external returns ( uint256 amountA, uint256 amountB )',
  'function removeLiquidityETH ( address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline ) external returns ( uint256 amountToken, uint256 amountETH )',
  'function renounceOwnership (  ) external',
  'function registerAffiliate( address[] calldata path ) external payable',
  'function router (  ) external view returns ( address )',
  'function cycleInSeconds (  ) external view returns ( uint256 )',
  'function swapExactETHForTokens ( uint256 amountOutMin, address[] path, address to, uint256 deadline, address affiliate ) external payable returns ( uint256[] amounts )',
  'function symbol (  ) external view returns ( string )',
  'function totalSupply (  ) external view returns ( uint256 )',
  'function transfer ( address to, uint256 amount ) external returns ( bool )',
  'function transferFrom ( address from, address to, uint256 amount ) external returns ( bool )',
  'function transferOwnership ( address newOwner ) external',
  'function wETH (  ) external view returns ( address )',
]

// transaction popup dismissal amounts
export const DEFAULT_TXN_DISMISS_MS = 10000
export const L2_TXN_DISMISS_MS = 5000

export const BIG_INT_ZERO = JSBI.BigInt(0)

export const BIPS_BASE = 10_000

// one basis JSBI.BigInt
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(1, 100) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(3, 100) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(5, 100) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(10, 100) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(15, 100) // 15%

export const ZERO_PERCENT = new Percent(0)
export const ONE_HUNDRED_PERCENT = new Percent(1)
