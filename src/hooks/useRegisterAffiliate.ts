import { parseEther } from '@ethersproject/units'
import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI, WETH_ADDRESS } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useRegisterAffiliate(instant?: boolean) {
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)

  return useCallback(async () => {
    if (!contract) throw new Error('missing contract')

    try {
      let affiliates
      if (instant) {
        affiliates = await contract.registerAffiliate([WETH_ADDRESS, CONTRACT_ADDRESS], { value: parseEther('0.1') })
      } else {
        affiliates = await contract.registerAffiliate([WETH_ADDRESS, CONTRACT_ADDRESS])
      }

      await affiliates.wait()
      console.log(affiliates)
      return affiliates
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract, instant])
}
