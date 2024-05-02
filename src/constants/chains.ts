import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId, SupportedChainsType } from './types'

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.GOERLI]: 'goerli',
  [SupportedChainId.SEPOLIA]: 'sepolia',
  [SupportedChainId.POLYGON]: 'polygon',
  [SupportedChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
  [SupportedChainId.CELO]: 'celo',
  [SupportedChainId.CELO_ALFAJORES]: 'celo_alfajores',
  [SupportedChainId.ARBITRUM_ONE]: 'arbitrum',
  [SupportedChainId.ARBITRUM_GOERLI]: 'arbitrum_goerli',
  [SupportedChainId.OPTIMISM]: 'optimism',
  [SupportedChainId.OPTIMISM_GOERLI]: 'optimism_goerli',
  [SupportedChainId.BNB]: 'bnb',
  [SupportedChainId.AVALANCHE]: 'avalanche',
  [SupportedChainId.BASE]: 'base',
} as const

// Include ChainIds in this array if they are not supported by the UX yet, but are already in the SDK.
const NOT_YET_UX_SUPPORTED_CHAIN_IDS: number[] = [
  SupportedChainId.BASE_GOERLI,
]

// TODO: include BASE_GOERLI when routing is implemented
// export type SupportedInterface = (typeof ALL_SUPPORTED_CHAIN_IDS)[number]
export type SupportedInterfaceChain = Exclude<SupportedChainsType, SupportedChainId.BASE_GOERLI>

export function isSupportedChain(
  chainId: number | null | undefined | SupportedChainId,
  featureFlags?: Record<number, boolean>
): chainId is SupportedInterfaceChain {
  if (featureFlags && chainId && chainId in featureFlags) {
    return featureFlags[chainId]
  }
  return (
    !!chainId &&
    ALL_SUPPORTED_CHAIN_IDS.indexOf(chainId) !== -1 &&
    NOT_YET_UX_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1
  )
}

export function asSupportedChain(
  chainId: number | null | undefined | SupportedChainId,
  featureFlags?: Record<number, boolean>
): SupportedInterfaceChain | undefined {
  if (!chainId) return undefined
  if (featureFlags && chainId in featureFlags && !featureFlags[chainId]) {
    return undefined
  }
  return isSupportedChain(chainId) ? chainId : undefined
}

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.CELO,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.BNB,
  SupportedChainId.AVALANCHE,
  SupportedChainId.BASE,
] as const

/**
 * Supported networks for V2 pool behavior.
 */
export const SUPPORTED_V2POOL_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.GOERLI,
] as const

export const TESTNET_CHAIN_IDS = [
  SupportedChainId.GOERLI,
  SupportedChainId.SEPOLIA,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.OPTIMISM_GOERLI,
  SupportedChainId.CELO_ALFAJORES,
] as const

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.GOERLI,
  SupportedChainId.SEPOLIA,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.CELO,
  SupportedChainId.CELO_ALFAJORES,
  SupportedChainId.BNB,
  SupportedChainId.AVALANCHE,
] as const

export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISM_GOERLI,
  SupportedChainId.BASE,
] as const

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number]

/**
 * Get the priority of a chainId based on its relevance to the user.
 * @param {ChainId} chainId - The chainId to determine the priority for.
 * @returns {number} The priority of the chainId, the lower the priority, the earlier it should be displayed, with base of MAINNET=0.
 */
export function getChainPriority(chainId: SupportedChainId): number {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.GOERLI:
    case SupportedChainId.SEPOLIA:
      return 0
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_GOERLI:
      return 1
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISM_GOERLI:
      return 2
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return 3
    case SupportedChainId.BASE:
      return 4
    case SupportedChainId.BNB:
      return 5
    case SupportedChainId.AVALANCHE:
      return 6
    case SupportedChainId.CELO:
    case SupportedChainId.CELO_ALFAJORES:
      return 7
    default:
      return 8
  }
}

export function isUniswapXSupportedChain(chainId: number) {
  return chainId === SupportedChainId.MAINNET
}
