import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useGetBootstrap() {
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(async () => {
    if (!contract) throw new Error('missing contract')

    try {
      const bootstrap = await contract.inBootstrap()

      return bootstrap
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract])
}
