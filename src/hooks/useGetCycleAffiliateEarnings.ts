import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useGetCycleAffiliateEarnings() {
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(
    async (address: string, cycle: number) => {
      if (!contract) throw new Error('missing contract')

      try {
        const earnings = await contract.cycleAffiliateEarnings(address, cycle)

        return earnings
      } catch (error) {
        // Handle errors
        console.error(error)
        throw error
      }
    },
    [contract]
  )
}
