// import { ethers } from 'ethers'
import IUniswapV2Router02Json from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import ERC20_ABI from 'abis/erc20.json'
import {
  CONTRACT_ADDRESS,
  PAIR_WETH_KONG,
  PAIR_WETH_USDT,
  UNISWAP_V2_ROUTER_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
} from 'constants/misc'
import { useCallback } from 'react'

import { useContract } from './useContract'

export function useGetWethUsdtPrice() {
  const { abi: IUniswapV2Router02ABI } = IUniswapV2Router02Json
  const contract = useContract(UNISWAP_V2_ROUTER_ADDRESS, IUniswapV2Router02ABI)
  const kongContract = useContract(CONTRACT_ADDRESS, ERC20_ABI)
  const wethContract = useContract(WETH_ADDRESS, ERC20_ABI)
  const usdtContract = useContract(USDT_ADDRESS, ERC20_ABI)

  return useCallback(async () => {
    if (!contract) throw new Error('missing contract')
    if (!kongContract) throw new Error('missing kongContract')
    if (!wethContract) throw new Error('missing wethContract')
    if (!usdtContract) throw new Error('missing usdtContract')

    try {
      /** TODO: change addresses for mainnet */
      const kongBalancePool = await kongContract.balanceOf(PAIR_WETH_KONG)
      let wethBalancePool = await wethContract.balanceOf(PAIR_WETH_KONG)

      const kongRate = await contract.quote(1e10, kongBalancePool, wethBalancePool)

      wethBalancePool = await wethContract.balanceOf(PAIR_WETH_USDT)
      const usdtBalancePool = await usdtContract.balanceOf(PAIR_WETH_USDT)

      const price = await contract.quote(kongRate, wethBalancePool, usdtBalancePool)

      return price.div(1e10).div(1e6).toNumber()
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [contract, kongContract, wethContract, usdtContract])
}
