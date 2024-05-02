import { BigNumber } from '@ethersproject/bignumber'
import { Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { CONTRACT_ADDRESS, SWAP_CONTRACT_ABI } from 'constants/misc'
// import { ethers } from 'ethers'
import { useCallback } from 'react'
import { ClassicTrade, TradeFillType } from 'state/routing/types'
import { WrongChainError } from 'utils/errors'

import { useContract } from './useContract'
import { useGetReferral } from './useGetReferral'

// Other imports remain the same
interface SwapOptions {
  slippageTolerance: Percent
  deadline?: BigNumber
  // Other options may remain or be removed based on the contract's functionality
}

export function useSwapExactETHForTokens(trade: ClassicTrade | undefined, options: SwapOptions) {
  const { account, chainId, provider } = useWeb3React()
  const contract = useContract(CONTRACT_ADDRESS, SWAP_CONTRACT_ABI)
  const referral = useGetReferral()

  return useCallback(async () => {
    // Ensure necessary data is available
    if (!account) throw new Error('missing account')
    if (!chainId) throw new Error('missing chainId')
    if (!provider) throw new Error('missing provider')
    if (!trade) throw new Error('missing trade')
    if (!contract) throw new Error('missing contract')

    const connectedChainId = await provider.getSigner().getChainId()
    if (chainId !== connectedChainId) throw new WrongChainError()

    const existingReferral = await referral()
    try {
      // Prepare parameters for the swap method
      let amountOutMin = BigNumber.from(trade.minimumAmountOut(options.slippageTolerance).quotient.toString())
      if (existingReferral) {
        amountOutMin = amountOutMin.mul(90).div(100)
      }
      const path = trade.routes[0].path.map((token) => token.address)
      const deadline = options.deadline?.toString()
      const value = BigNumber.from(trade.inputAmount.quotient.toString())

      // Send transaction
      const txResponse = await contract.swapExactETHForTokens(
        amountOutMin,
        path,
        account,
        deadline,
        existingReferral,
        { value }
      )

      return {
        type: TradeFillType.Classic as const,
        response: txResponse,
      }
    } catch (error) {
      // Handle errors
      console.error(error)
      throw error
    }
  }, [account, chainId, provider, trade, options.slippageTolerance, options.deadline, contract, referral])
}
