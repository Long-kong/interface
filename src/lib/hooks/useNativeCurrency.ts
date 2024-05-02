import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { nativeOnChain } from 'constants/tokens'
import { SupportedChainId } from 'constants/types'
import { useMemo } from 'react'

export default function useNativeCurrency(chainId: SupportedChainId | null | undefined): NativeCurrency | Token {
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(SupportedChainId.MAINNET),
    [chainId]
  )
}
