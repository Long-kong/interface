// import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'

export function useGetBlockNumber() {
  const { provider } = useWeb3React()

  return useCallback(async () => {
    if (!provider) throw new Error('missing provider')

    try {
      const blockNumber = await provider.getBlockNumber()
      const timestamp = await provider.getBlock(blockNumber)

      return timestamp
    } catch (error) {
      // Handle errorsasync
      console.error(error)
      throw error
    }
  }, [provider])
}
