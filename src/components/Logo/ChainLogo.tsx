import { getChainInfo } from 'constants/chainInfo'
import { isSupportedChain, SupportedInterfaceChain } from 'constants/chains'
import { SupportedChainId } from 'constants/types'
import { CSSProperties, FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import { useIsDarkMode } from 'theme/components/ThemeToggle'

import { ReactComponent as arbitrum } from './ChainSymbols/arbitrum.svg'
import { ReactComponent as avax } from './ChainSymbols/avax.svg'
import { ReactComponent as base } from './ChainSymbols/base.svg'
import { ReactComponent as bnb } from './ChainSymbols/bnb.svg'
import { ReactComponent as celo } from './ChainSymbols/celo.svg'
import { ReactComponent as celoLight } from './ChainSymbols/celo_light.svg'
import { ReactComponent as ethereum } from './ChainSymbols/ethereum.svg'
import { ReactComponent as optimism } from './ChainSymbols/optimism.svg'
import { ReactComponent as polygon } from './ChainSymbols/polygon.svg'

type SVG = FunctionComponent<React.SVGProps<SVGSVGElement>>
type ChainUI = { Symbol: SVG; bgColor: string; textColor: string }

export function getChainUI(chainId: SupportedInterfaceChain, darkMode: boolean): ChainUI
export function getChainUI(chainId: SupportedChainId, darkMode: boolean): ChainUI | undefined {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.GOERLI:
    case SupportedChainId.SEPOLIA:
      return {
        Symbol: ethereum,
        bgColor: '#6B8AFF33',
        textColor: '#6B8AFF',
      }
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return {
        Symbol: polygon,
        bgColor: '#9558FF33',
        textColor: '#9558FF',
      }
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_GOERLI:
      return {
        Symbol: arbitrum,
        bgColor: '#00A3FF33',
        textColor: '#00A3FF',
      }
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISM_GOERLI:
      return {
        Symbol: optimism,
        bgColor: '#FF042033',
        textColor: '#FF0420',
      }
    case SupportedChainId.CELO:
    case SupportedChainId.CELO_ALFAJORES:
      return darkMode
        ? {
            Symbol: celo,
            bgColor: '#FCFF5233',
            textColor: '#FCFF52',
          }
        : {
            Symbol: celoLight,
            bgColor: '#FCFF5299',
            textColor: '#655947',
          }
    case SupportedChainId.AVALANCHE:
      return {
        Symbol: avax,
        bgColor: '#E8414233',
        textColor: '#E84142',
      }
    case SupportedChainId.BNB:
      return {
        Symbol: bnb,
        bgColor: '#EAB20033',
        textColor: '#EAB200',
      }
    case SupportedChainId.BASE:
      return {
        Symbol: base,
        bgColor: '#0052FF33',
        textColor: '#0052FF',
      }
    default:
      return undefined
  }
}

export const getDefaultBorderRadius = (size: number) => size / 2 - 4

type ChainLogoProps = {
  chainId: SupportedChainId
  className?: string
  size?: number
  borderRadius?: number
  style?: CSSProperties
  testId?: string
}
export function ChainLogo({
  chainId,
  className,
  style,
  size = 16,
  borderRadius = getDefaultBorderRadius(size),
  testId,
}: ChainLogoProps) {
  const darkMode = useIsDarkMode()
  const { surface2 } = useTheme()

  if (!isSupportedChain(chainId)) return null
  const { label } = getChainInfo(chainId)

  const { Symbol, bgColor } = getChainUI(chainId, darkMode)
  return (
    <svg width={size} height={size} className={className} style={style} aria-labelledby="titleID" data-testid={testId}>
      <title id="titleID">{`${label} logo`}</title>
      <rect rx={borderRadius} fill={surface2} width={size} height={size} />
      <rect rx={borderRadius} fill={bgColor} width={size} height={size} />
      <Symbol width={size} height={size} />
    </svg>
  )
}
