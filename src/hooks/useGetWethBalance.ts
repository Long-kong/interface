// import { ethers } from 'ethers'
import ERC20_ABI from 'abis/erc20.json'
import { CONTRACT_ADDRESS, WETH_ADDRESS } from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useGetWethBalance() {
  const wethContract = useContract(WETH_ADDRESS, ERC20_ABI)

  return useCallback(async () => {
    if (!wethContract) throw new Error('missing wethContract')

    try {
      const wethBalancePool = await wethContract.balanceOf(CONTRACT_ADDRESS)

      return wethBalancePool
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [wethContract])
}
