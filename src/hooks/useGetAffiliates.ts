// import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useGetAffiliates() {
  const { provider } = useWeb3React()
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(async () => {
    if (!provider) throw new Error('missing provider')
    if (!contract) throw new Error('missing contract')

    const signer = provider.getSigner()
    try {
      const ownerAddress = await signer.getAddress()
      const affiliates = await contract.affiliates(ownerAddress)

      return affiliates
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract, provider])
}
