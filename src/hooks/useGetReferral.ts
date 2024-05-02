// import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI, ZERO_ADDRESS } from 'constants/misc'
import { useCallback } from 'react'
import { isAddress } from 'utils'

import { useContract } from './useContract'

export function useGetReferral() {
  const { provider } = useWeb3React()
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(async () => {
    if (!provider) throw new Error('missing provider')
    if (!contract) throw new Error('missing contract')
    const signer = provider.getSigner()
    if (!signer) throw new Error('missing signer')
    try {
      const ownerAddress = await signer.getAddress()
      if (!ownerAddress) throw new Error('missing ownerAddress')
      let affiliates = await contract.affiliates(ownerAddress)

      if (affiliates === ZERO_ADDRESS) {
        const localReferral = localStorage.getItem('referral')
        if (localReferral) {
          affiliates = isAddress(localReferral) || ZERO_ADDRESS
        }
      }

      return affiliates
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract, provider])
}
