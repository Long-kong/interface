import { getChainPriority } from './chains'
import { SupportedChainId } from './types'

// Define an array of test cases with chainId and expected priority
const chainPriorityTestCases: [SupportedChainId, number][] = [
  [SupportedChainId.MAINNET, 0],
  [SupportedChainId.GOERLI, 0],
  [SupportedChainId.SEPOLIA, 0],
  [SupportedChainId.ARBITRUM_ONE, 1],
  [SupportedChainId.ARBITRUM_GOERLI, 1],
  [SupportedChainId.OPTIMISM, 2],
  [SupportedChainId.OPTIMISM_GOERLI, 2],
  [SupportedChainId.POLYGON, 3],
  [SupportedChainId.POLYGON_MUMBAI, 3],
  [SupportedChainId.BASE, 4],
  [SupportedChainId.BNB, 5],
  [SupportedChainId.AVALANCHE, 6],
  [SupportedChainId.CELO, 7],
  [SupportedChainId.CELO_ALFAJORES, 7],
]

test.each(chainPriorityTestCases)(
  'getChainPriority returns expected priority for a given ChainId %O',
  (chainId: SupportedChainId, expectedPriority: number) => {
    const priority = getChainPriority(chainId)
    expect(priority).toBe(expectedPriority)
  }
)
