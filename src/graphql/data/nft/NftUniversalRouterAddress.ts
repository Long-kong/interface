import { UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk'
import { isSupportedChain } from 'constants/chains'
import { SupportedChainId } from 'constants/types'
import gql from 'graphql-tag'

import { useNftUniversalRouterAddressQuery } from '../__generated__/types-and-hooks'

gql`
  query NftUniversalRouterAddress($chain: Chain = ETHEREUM) {
    nftRoute(chain: $chain, senderAddress: "", nftTrades: []) {
      toAddress
    }
  }
`

export function getURAddress(chainId?: number, nftURAddress?: string): string | undefined {
  if (!chainId) return undefined
  // if mainnet and on NFT flow, use the contract address returned by GQL
  if (chainId === SupportedChainId.MAINNET) {
    return nftURAddress ?? UNIVERSAL_ROUTER_ADDRESS(chainId)
  }
  return isSupportedChain(chainId) ? UNIVERSAL_ROUTER_ADDRESS(chainId) : undefined
}

export function useNftUniversalRouterAddress() {
  const { data, loading } = useNftUniversalRouterAddressQuery({
    // no cache because a different version of nftRoute query is going to be called around the same time
    fetchPolicy: 'no-cache',
  })

  return {
    universalRouterAddress: data?.nftRoute?.toAddress,
    universalRouterAddressIsLoading: loading,
  }
}
