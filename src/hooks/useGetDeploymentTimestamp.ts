// import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useGetDeploymentTimestamp() {
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(async () => {
    if (!contract) throw new Error('missing contract')

    try {
      const deploymentTimestamp = await contract.deploymentTimestamp()

      return deploymentTimestamp
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract])
}
