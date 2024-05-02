// a list of tokens by chain
import { Currency, Token } from '@uniswap/sdk-core'

import {
  ARB,
  BTC_BSC,
  BUSD_BSC,
  CEUR_CELO,
  CEUR_CELO_ALFAJORES,
  CUSD_CELO,
  CUSD_CELO_ALFAJORES,
  DAI,
  DAI_ARBITRUM_ONE,
  DAI_AVALANCHE,
  DAI_BSC,
  DAI_OPTIMISM,
  DAI_POLYGON,
  ETH_BSC,
  KONG_MAINNET,
  nativeOnChain,
  OP,
  PORTAL_ETH_CELO,
  PORTAL_USDC_CELO,
  USDC_ARBITRUM,
  USDC_ARBITRUM_GOERLI,
  USDC_AVALANCHE,
  USDC_BASE,
  USDC_BSC,
  USDC_MAINNET,
  USDC_OPTIMISM,
  USDC_OPTIMISM_GOERLI,
  USDC_POLYGON,
  USDC_POLYGON_MUMBAI,
  USDT,
  USDT_ARBITRUM_ONE,
  USDT_AVALANCHE,
  USDT_BSC,
  USDT_OPTIMISM,
  USDT_POLYGON,
  WBTC,
  WBTC_ARBITRUM_ONE,
  WBTC_CELO,
  WBTC_OPTIMISM,
  WBTC_POLYGON,
  WETH_AVALANCHE,
  WETH_POLYGON,
  WETH_POLYGON_MUMBAI,
  WRAPPED_NATIVE_CURRENCY,
} from './tokens'
import { SupportedChainId } from './types'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean)
)

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
  [SupportedChainId.MAINNET]: [nativeOnChain(SupportedChainId.MAINNET), KONG_MAINNET],
  [SupportedChainId.GOERLI]: [
    nativeOnChain(SupportedChainId.GOERLI),
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.GOERLI] as Token,
  ],
  [SupportedChainId.SEPOLIA]: [
    nativeOnChain(SupportedChainId.SEPOLIA),
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.SEPOLIA] as Token,
  ],

  [SupportedChainId.ARBITRUM_ONE]: [
    nativeOnChain(SupportedChainId.ARBITRUM_ONE),
    ARB,
    DAI_ARBITRUM_ONE,
    USDC_ARBITRUM,
    USDT_ARBITRUM_ONE,
    WBTC_ARBITRUM_ONE,
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.ARBITRUM_ONE] as Token,
  ],
  [SupportedChainId.ARBITRUM_GOERLI]: [
    nativeOnChain(SupportedChainId.ARBITRUM_GOERLI),
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.ARBITRUM_GOERLI] as Token,
    USDC_ARBITRUM_GOERLI,
  ],

  [SupportedChainId.OPTIMISM]: [
    nativeOnChain(SupportedChainId.OPTIMISM),
    OP,
    DAI_OPTIMISM,
    USDC_OPTIMISM,
    USDT_OPTIMISM,
    WBTC_OPTIMISM,
  ],
  [SupportedChainId.OPTIMISM_GOERLI]: [nativeOnChain(SupportedChainId.OPTIMISM_GOERLI), USDC_OPTIMISM_GOERLI],

  [SupportedChainId.BASE]: [
    nativeOnChain(SupportedChainId.BASE),
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.BASE] as Token,
    USDC_BASE,
  ],

  [SupportedChainId.POLYGON]: [
    nativeOnChain(SupportedChainId.POLYGON),
    WETH_POLYGON,
    USDC_POLYGON,
    DAI_POLYGON,
    USDT_POLYGON,
    WBTC_POLYGON,
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    nativeOnChain(SupportedChainId.POLYGON_MUMBAI),
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.POLYGON_MUMBAI] as Token,
    USDC_POLYGON_MUMBAI,
    WETH_POLYGON_MUMBAI,
  ],

  [SupportedChainId.CELO]: [
    nativeOnChain(SupportedChainId.CELO),
    CEUR_CELO,
    CUSD_CELO,
    PORTAL_ETH_CELO,
    PORTAL_USDC_CELO,
    WBTC_CELO,
  ],
  [SupportedChainId.CELO_ALFAJORES]: [
    nativeOnChain(SupportedChainId.CELO_ALFAJORES),
    CUSD_CELO_ALFAJORES,
    CEUR_CELO_ALFAJORES,
  ],

  [SupportedChainId.BNB]: [
    nativeOnChain(SupportedChainId.BNB),
    DAI_BSC,
    USDC_BSC,
    USDT_BSC,
    ETH_BSC,
    BTC_BSC,
    BUSD_BSC,
  ],

  [SupportedChainId.AVALANCHE]: [
    nativeOnChain(SupportedChainId.AVALANCHE),
    DAI_AVALANCHE,
    USDC_AVALANCHE,
    USDT_AVALANCHE,
    WETH_AVALANCHE,
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [SupportedChainId.MAINNET]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.MAINNET],
    DAI,
    USDC_MAINNET,
    USDT,
    WBTC,
  ],
  [SupportedChainId.BNB]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.BNB],
    DAI_BSC,
    USDC_BSC,
    USDT_BSC,
    BTC_BSC,
    BUSD_BSC,
    ETH_BSC,
  ],
  [SupportedChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.AVALANCHE],
    DAI_AVALANCHE,
    USDC_AVALANCHE,
    USDT_AVALANCHE,
    WETH_AVALANCHE,
  ],
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [SupportedChainId.MAINNET]: [
    [
      new Token(SupportedChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(
        SupportedChainId.MAINNET,
        '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
        8,
        'cUSDC',
        'Compound USD Coin'
      ),
    ],
    [USDC_MAINNET, USDT],
    [DAI, USDT],
  ],
}
