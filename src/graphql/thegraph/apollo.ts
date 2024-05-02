import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { SupportedChainId } from 'constants/types'

import store from '../../state/index'

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap',
  [SupportedChainId.ARBITRUM_ONE]:
    'https://thegraph.com/hosted-service/subgraph/ianlapham/uniswap-arbitrum-one?source=uniswap',
  [SupportedChainId.OPTIMISM]:
    'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis?source=uniswap',
  [SupportedChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon?source=uniswap',
  [SupportedChainId.CELO]: 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo?source=uniswap',
  [SupportedChainId.BNB]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc?source=uniswap',
  [SupportedChainId.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/lynnshaoyu/uniswap-v3-avax?source=uniswap',
  [SupportedChainId.BASE]: 'https://api.studio.thegraph.com/query/48211/uniswap-v3-base/version/latest',
}

const CHAIN_BLOCK_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks?source=uniswap',
  [SupportedChainId.ARBITRUM_ONE]:
    'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks?source=uniswap',
  [SupportedChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uni-testing-subgraph?source=uniswap',
  [SupportedChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/polygon-blocks?source=uniswap',
  [SupportedChainId.CELO]: 'https://api.thegraph.com/subgraphs/name/jesse-sawa/celo-blocks?source=uniswap',
  [SupportedChainId.BNB]: 'https://api.thegraph.com/subgraphs/name/wombat-exchange/bnb-chain-block?source=uniswap',
  [SupportedChainId.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/lynnshaoyu/avalanche-blocks?source=uniswap',
  [SupportedChainId.BASE]: 'https://api.studio.thegraph.com/query/48211/base-blocks/version/latest?source=uniswap',
}

const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET] })

// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = store.getState().application.chainId

  operation.setContext(() => ({
    uri:
      chainId && CHAIN_SUBGRAPH_URL[chainId]
        ? CHAIN_SUBGRAPH_URL[chainId]
        : CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET],
  }))

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
})

export const chainToApolloClient: Record<number, ApolloClient<NormalizedCacheObject>> = {
  [SupportedChainId.MAINNET]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.MAINNET],
  }),
  [SupportedChainId.ARBITRUM_ONE]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.ARBITRUM_ONE],
  }),
  [SupportedChainId.OPTIMISM]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.OPTIMISM],
  }),
  [SupportedChainId.POLYGON]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.POLYGON],
  }),
  [SupportedChainId.CELO]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.CELO],
  }),
  [SupportedChainId.BNB]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.BNB],
  }),
  [SupportedChainId.AVALANCHE]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[SupportedChainId.AVALANCHE],
  }),
}

export const chainToApolloBlockClient: Record<number, ApolloClient<NormalizedCacheObject>> = {
  [SupportedChainId.MAINNET]: new ApolloClient({
    uri: CHAIN_BLOCK_SUBGRAPH_URL[SupportedChainId.MAINNET],
    cache: new InMemoryCache(),
  }),
  [SupportedChainId.ARBITRUM_ONE]: new ApolloClient({
    uri: CHAIN_BLOCK_SUBGRAPH_URL[SupportedChainId.ARBITRUM_ONE],
    cache: new InMemoryCache(),
  }),
  [SupportedChainId.OPTIMISM]: new ApolloClient({
    uri: CHAIN_BLOCK_SUBGRAPH_URL[SupportedChainId.OPTIMISM],
    cache: new InMemoryCache(),
  }),
  [SupportedChainId.POLYGON]: new ApolloClient({
    uri: CHAIN_BLOCK_SUBGRAPH_URL[SupportedChainId.POLYGON],
    cache: new InMemoryCache(),
  }),
  [SupportedChainId.CELO]: new ApolloClient({
    uri: CHAIN_BLOCK_SUBGRAPH_URL[SupportedChainId.CELO],
    cache: new InMemoryCache(),
  }),
  [SupportedChainId.BNB]: new ApolloClient({
    uri: CHAIN_BLOCK_SUBGRAPH_URL[SupportedChainId.BNB],
    cache: new InMemoryCache(),
  }),
  [SupportedChainId.AVALANCHE]: new ApolloClient({
    uri: CHAIN_BLOCK_SUBGRAPH_URL[SupportedChainId.AVALANCHE],
    cache: new InMemoryCache(),
  }),
}
