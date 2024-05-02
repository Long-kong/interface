import AppRpcProvider from 'rpc/AppRpcProvider'
import AppStaticJsonRpcProvider from 'rpc/StaticJsonRpcProvider'
import StaticJsonRpcProvider from 'rpc/StaticJsonRpcProvider'

import { SupportedInterfaceChain } from './chains'
import { RPC_URLS } from './networks'
import { SupportedChainId } from './types'

const providerFactory = (chainId: SupportedInterfaceChain, i = 0) =>
  new AppStaticJsonRpcProvider(chainId, RPC_URLS[chainId][i])

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */
export const RPC_PROVIDERS: { [key in SupportedInterfaceChain]: StaticJsonRpcProvider } = {
  [SupportedChainId.MAINNET]: new AppRpcProvider(SupportedChainId.MAINNET, [
    providerFactory(SupportedChainId.MAINNET),
    providerFactory(SupportedChainId.MAINNET, 1),
  ]),
  [SupportedChainId.GOERLI]: providerFactory(SupportedChainId.GOERLI),
  [SupportedChainId.SEPOLIA]: providerFactory(SupportedChainId.SEPOLIA),
  [SupportedChainId.OPTIMISM]: providerFactory(SupportedChainId.OPTIMISM),
  [SupportedChainId.OPTIMISM_GOERLI]: providerFactory(SupportedChainId.OPTIMISM_GOERLI),
  [SupportedChainId.ARBITRUM_ONE]: providerFactory(SupportedChainId.ARBITRUM_ONE),
  [SupportedChainId.ARBITRUM_GOERLI]: providerFactory(SupportedChainId.ARBITRUM_GOERLI),
  [SupportedChainId.POLYGON]: providerFactory(SupportedChainId.POLYGON),
  [SupportedChainId.POLYGON_MUMBAI]: providerFactory(SupportedChainId.POLYGON_MUMBAI),
  [SupportedChainId.CELO]: providerFactory(SupportedChainId.CELO),
  [SupportedChainId.CELO_ALFAJORES]: providerFactory(SupportedChainId.CELO_ALFAJORES),
  [SupportedChainId.BNB]: providerFactory(SupportedChainId.BNB),
  [SupportedChainId.AVALANCHE]: providerFactory(SupportedChainId.AVALANCHE),
  [SupportedChainId.BASE]: providerFactory(SupportedChainId.BASE),
}

export const DEPRECATED_RPC_PROVIDERS: { [key in SupportedInterfaceChain]: AppStaticJsonRpcProvider } = {
  [SupportedChainId.MAINNET]: providerFactory(SupportedChainId.MAINNET),
  [SupportedChainId.GOERLI]: providerFactory(SupportedChainId.GOERLI),
  [SupportedChainId.SEPOLIA]: providerFactory(SupportedChainId.SEPOLIA),
  [SupportedChainId.OPTIMISM]: providerFactory(SupportedChainId.OPTIMISM),
  [SupportedChainId.OPTIMISM_GOERLI]: providerFactory(SupportedChainId.OPTIMISM_GOERLI),
  [SupportedChainId.ARBITRUM_ONE]: providerFactory(SupportedChainId.ARBITRUM_ONE),
  [SupportedChainId.ARBITRUM_GOERLI]: providerFactory(SupportedChainId.ARBITRUM_GOERLI),
  [SupportedChainId.POLYGON]: providerFactory(SupportedChainId.POLYGON),
  [SupportedChainId.POLYGON_MUMBAI]: providerFactory(SupportedChainId.POLYGON_MUMBAI),
  [SupportedChainId.CELO]: providerFactory(SupportedChainId.CELO),
  [SupportedChainId.CELO_ALFAJORES]: providerFactory(SupportedChainId.CELO_ALFAJORES),
  [SupportedChainId.BNB]: providerFactory(SupportedChainId.BNB),
  [SupportedChainId.AVALANCHE]: providerFactory(SupportedChainId.AVALANCHE),
  [SupportedChainId.BASE]: providerFactory(SupportedChainId.BASE),
}
