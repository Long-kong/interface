// import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

// Define the ABI for the smart contract

export function useGetCycleInSeconds() {
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(async () => {
    if (!contract) throw new Error('missing contract')

    try {
      // Send transaction
      const cycleInSeconds = await contract.cycleInSeconds()

      return cycleInSeconds
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract])
}
