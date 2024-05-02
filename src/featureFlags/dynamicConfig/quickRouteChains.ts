import { SupportedChainId } from 'constants/types'
import { useFeatureFlagsContext } from 'featureFlags'

import { DynamicConfigName, useDynamicConfig } from '.'

export function useQuickRouteChains(): SupportedChainId[] {
  const statsigConfig = useDynamicConfig(DynamicConfigName.quickRouteChains)
  const featureFlagsContext = useFeatureFlagsContext()

  const remoteConfigChains = statsigConfig.get(DynamicConfigName.quickRouteChains, []) as SupportedChainId[]
  const localConfigChains =
    featureFlagsContext.configs[DynamicConfigName.quickRouteChains]?.[DynamicConfigName.quickRouteChains]

  const chains = Array.isArray(localConfigChains) ? localConfigChains : remoteConfigChains
  if (chains.every((c) => Object.values(SupportedChainId).includes(c))) {
    return chains
  } else {
    console.error('feature flag config chains contain invalid ChainId')
    return []
  }
}
