import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useAffiliateTimestamp(affiliate: string | undefined | null) {
  // const { account } = useWeb3React()
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(async () => {
    if (!contract) throw new Error('missing contract')
    if (!affiliate) throw new Error('missing affiliate address')

    try {
      const affiliateTimestamp = await contract.affiliateStartTimestamp(affiliate)

      return affiliateTimestamp
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract, affiliate])
}
