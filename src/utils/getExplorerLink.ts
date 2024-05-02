import { SupportedChainId } from 'constants/types'

const BLOCK_EXPLORER_PREFIXES: { [chainId: number]: string } = {
  [SupportedChainId.MAINNET]: 'https://etherscan.io',
  [SupportedChainId.GOERLI]: 'https://goerli.etherscan.io',
  [SupportedChainId.SEPOLIA]: 'https://sepolia.etherscan.io',
  [SupportedChainId.ARBITRUM_ONE]: 'https://arbiscan.io',
  [SupportedChainId.ARBITRUM_GOERLI]: 'https://goerli.arbiscan.io',
  [SupportedChainId.OPTIMISM]: 'https://optimistic.etherscan.io',
  [SupportedChainId.OPTIMISM_GOERLI]: 'https://goerli-optimism.etherscan.io',
  [SupportedChainId.POLYGON]: 'https://polygonscan.com',
  [SupportedChainId.POLYGON_MUMBAI]: 'https://mumbai.polygonscan.com',
  [SupportedChainId.CELO]: 'https://celoscan.io',
  [SupportedChainId.CELO_ALFAJORES]: 'https://alfajores-blockscout.celo-testnet.org',
  [SupportedChainId.BNB]: 'https://bscscan.com',
  [SupportedChainId.AVALANCHE]: 'https://snowtrace.io',
  [SupportedChainId.BASE]: 'https://basescan.org',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
  NATIVE = 'native',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
  const prefix = BLOCK_EXPLORER_PREFIXES[chainId] ?? 'https://etherscan.io'

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`

    case ExplorerDataType.BLOCK:
      return `${prefix}/block/${data}`

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`
    default:
      return `${prefix}`
  }
}
