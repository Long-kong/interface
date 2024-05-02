import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/types'
import { render } from 'test-utils/render'

import ChainSelectorRow from './ChainSelectorRow'

describe('ChainSelectorRow', () => {
  ALL_SUPPORTED_CHAIN_IDS.forEach((chainId) => {
    it(`should match snapshot for chainId ${chainId}`, () => {
      const { container } = render(
        <ChainSelectorRow targetChain={chainId} onSelectChain={jest.fn()} isPending={false} disabled={false} />
      )
      expect(container).toMatchSnapshot()
    })
  })

  it('should be clickable when enabled', () => {
    const onSelectChain = jest.fn()
    const { getByTestId } = render(
      <ChainSelectorRow
        targetChain={SupportedChainId.OPTIMISM}
        onSelectChain={onSelectChain}
        isPending={false}
        disabled={false}
      />
    )
    const button = getByTestId('Optimism-selector')
    button.click()
    expect(onSelectChain).toHaveBeenCalled()
  })

  it('should not be clickable when disabled', () => {
    const onSelectChain = jest.fn()
    const { getByTestId } = render(
      <ChainSelectorRow
        targetChain={SupportedChainId.OPTIMISM}
        onSelectChain={onSelectChain}
        isPending={false}
        disabled={true}
      />
    )
    const button = getByTestId('Optimism-selector')
    button.click()
    expect(onSelectChain).not.toHaveBeenCalled()
  })
})
