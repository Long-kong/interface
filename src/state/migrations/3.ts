import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/types'
import { PersistState } from 'redux-persist'
import { serializeToken } from 'state/user/hooks'
import { UserState } from 'state/user/reducer'

export type PersistAppStateV3 = {
  _persist: PersistState
} & { user?: UserState }

/**
 * Migration to clear users' imported token lists, after
 * breaking changes to token info for multichain native USDC.
 */
export const migration3 = (state: PersistAppStateV3 | undefined) => {
  if (state?.user) {
    // Update USDC.e tokens to use the the new USDC.e symbol (from USDC)
    const USDCe_ADDRESSES: { [key in SupportedChainId]?: string } = {
      [SupportedChainId.OPTIMISM]: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      [SupportedChainId.OPTIMISM_GOERLI]: '0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E',
      [SupportedChainId.ARBITRUM_ONE]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      [SupportedChainId.ARBITRUM_GOERLI]: '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
      [SupportedChainId.AVALANCHE]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      [SupportedChainId.POLYGON]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      [SupportedChainId.POLYGON_MUMBAI]: '0xe11a86849d99f524cac3e7a0ec1241828e332c62',
    }
    for (const [chainId, address] of Object.entries(USDCe_ADDRESSES)) {
      const chainIdKey = Number(chainId) as SupportedChainId
      if (state.user.tokens[chainIdKey]?.[address]) {
        state.user.tokens[chainIdKey][address] = serializeToken(
          new Token(chainIdKey, address, 6, 'USDC.e', 'Bridged USDC')
        )
      }
    }
    // Update USDbC token to use the new USDbC symbol (from USDC)
    const USDbC_BASE = new Token(
      SupportedChainId.BASE,
      '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      6,
      'USDbC',
      'USD Base Coin'
    )
    if (state.user.tokens[SupportedChainId.BASE]?.[USDbC_BASE.address]) {
      state.user.tokens[SupportedChainId.BASE][USDbC_BASE.address] = serializeToken(USDbC_BASE)
    }
    return {
      ...state,
      _persist: {
        ...state._persist,
        version: 3,
      },
    }
  }
  return state
}
