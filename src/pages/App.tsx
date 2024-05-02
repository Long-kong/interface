import { CustomUserProperties, getBrowser, SharedEventName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { getDeviceId, sendAnalyticsEvent, sendInitializationEvent, Trace, user } from 'analytics'
import AppBackground from 'assets/images/background.jpeg'
import KingKong from 'assets/images/king-kong.png'
import ErrorBoundary from 'components/ErrorBoundary'
import Loader from 'components/Icons/LoadingSpinner'
import NavBar, { PageTabs } from 'components/NavBar'
import { UK_BANNER_HEIGHT, UK_BANNER_HEIGHT_MD, UK_BANNER_HEIGHT_SM, UkBanner } from 'components/NavBar/UkBanner'
import { NewsBarComponent } from 'components/NewsBar/NewsBar'
import { FeatureFlag, useFeatureFlagsIsLoaded } from 'featureFlags'
import { useUniswapXDefaultEnabled } from 'featureFlags/flags/uniswapXDefault'
import { useGetWethUsdtPrice } from 'hooks/useGetWethUsdtPrice'
import { useAtom } from 'jotai'
import { useBag } from 'nft/hooks/useBag'
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import { useAppSelector } from 'state/hooks'
import { AppState } from 'state/reducer'
import { RouterPreference } from 'state/routing/types'
import { useRouterPreference, useUserOptedOutOfUniswapX } from 'state/user/hooks'
import { StatsigUser, useGate } from 'statsig-react'
import styled from 'styled-components'
import { keyframes } from 'styled-components'
import { BREAKPOINTS } from 'theme'
import DarkModeQueryParamReader from 'theme/components/DarkModeQueryParamReader'
import { useIsDarkMode } from 'theme/components/ThemeToggle'
import { flexRowNoWrap } from 'theme/styles'
import { Z_INDEX } from 'theme/zIndex'
import { isPathBlocked } from 'utils/blockedPaths'
import { getCurrentPageFromLocation } from 'utils/urlRoutes'
import { getCLS, getFCP, getFID, getLCP, Metric } from 'web-vitals'

import { RouteDefinition, routes, useRouterConfig } from './RouteDefinitions'

const AppChrome = lazy(() => import('./AppChrome'))

const SMALL_STRIP_HEIGHT = 35

const BodyWrapper = styled.div<{ bannerIsVisible?: boolean; barIsVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT : 0)}px);
  min-height: calc(100vh - ${({ barIsVisible }) => (barIsVisible ? SMALL_STRIP_HEIGHT : 0)}px);
  padding: ${({ theme }) => theme.navHeight}px 0 0 0;
  align-items: center;
  flex: 1;
  position: relative;
  background-image: url(${AppBackground});
  background-size: cover;
  background-position: center;
  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT_MD : 0)}px);
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT_SM : 0)}px);
  }
`

const MobileBottomBar = styled.div`
  z-index: ${Z_INDEX.sticky};
  position: fixed;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  bottom: 0;
  right: 0;
  left: 0;
  width: calc(100vw - 16px);
  justify-content: space-between;
  padding: 0px 4px;
  height: ${({ theme }) => theme.mobileBottomBarHeight}px;
  background: ${({ theme }) => theme.surface1};
  border: 1px solid ${({ theme }) => theme.surface3};
  margin: 8px;
  border-radius: 20px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.md}px) {
    display: none;
  }
`

const HeaderWrapper = styled.div<{
  transparent?: boolean
  bannerIsVisible?: boolean
  scrollY: number
  barIsVisible?: boolean
}>`
  ${flexRowNoWrap};
  background-color: ${({ theme, transparent }) => !transparent && theme.surface1};
  border-bottom: ${({ theme, transparent }) => !transparent && `1px solid ${theme.surface3}`};
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT - scrollY, 0) : 0)}px;
  top: ${({ barIsVisible }) => (barIsVisible ? Math.max(SMALL_STRIP_HEIGHT - scrollY, 0) : 0)}px;
  z-index: ${Z_INDEX.dropdown};

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_MD - scrollY, 0) : 0)}px;
    top: ${({ barIsVisible }) => (barIsVisible ? Math.max(SMALL_STRIP_HEIGHT - scrollY, 0) : 0)}px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_SM - scrollY, 0) : 0)}px;
    top: ${({ barIsVisible }) => (barIsVisible ? Math.max(SMALL_STRIP_HEIGHT - scrollY, 0) : 0)}px;
  }
`

const SmallStrip = styled.div`
  position: relative;
  z-index: 1020;
  width: 100%;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: bold;
  color: white;
  background: #0637a5;
  padding: 8px;
  height: ${SMALL_STRIP_HEIGHT}px;
  div {
    display: flex;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  span {
    color: #112147;
    position: absolute;
    right: 0;
    cursor: pointer;
  }
`

const pulse = keyframes`
0% {
  transform: scale(0.95);
  box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
}

70% {
  transform: scale(1);
  box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
}

100% {
  transform: scale(0.95);
  box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
}
`

const LiveText = styled.div<{
  bannerIsVisible?: boolean
  barIsVisible?: boolean
}>`
  top: 0;
  left: 0;
  align-self: start;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  z-index: 3;
  position: absolute;
  top: ${({ theme }) => theme.navHeight + 'px'};
  span:first-child {
    background: white;
    color: #ff2727;
    padding: 10px 15px;
    gap: 10px;
    display: inline-flex;
    align-items: center;
    &:before {
      content: '';
      display: block;
      width: 14px;
      height: 14px;
      background: rgba(255, 39, 39, 0.57);
      border-radius: 50%;
      position: relative;
      transform: scale(1);
      animation: ${pulse} 2s infinite;
    }
  }
  span:last-child {
    color: white;
    background: #ff2727;
    padding: 10px 15px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 24px;
  }
`

const KingKongDiv = styled.img`
  position: absolute;
  height: 320px;
  bottom: 0;
  right: 0;
  @media screen and (min-width: ${BREAKPOINTS.xs}px) {
    height: 720px;
    right: 80px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    height: 1024px;
    right: 191px;
  }
`

export default function App() {
  const [hiddenBar, setHiddenBar] = useState(false)

  const setBarPosition = useCallback(
    (save?: boolean | undefined): void => {
      const checkPosition = save !== undefined ? save : !hiddenBar
      sessionStorage.setItem('bar', JSON.stringify(checkPosition))
      setHiddenBar(checkPosition)
    },
    [hiddenBar]
  )

  const getWeth = useGetWethUsdtPrice()
  const [usdPrice, setUsdPrice] = useState(0)

  useEffect(() => {
    const menuPositionRight = JSON.parse(sessionStorage.getItem('bar') ?? 'false')

    setBarPosition(menuPositionRight)
  }, [setBarPosition])

  useEffect(() => {
    getWeth().then((usd) => {
      setUsdPrice(usd)
      return usd
    })

    const interval = setInterval(() => {
      getWeth().then((usd) => {
        setUsdPrice(usd)
        return usd
      })
    }, 5000)

    return () => clearInterval(interval) // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [getWeth])

  const isLoaded = useFeatureFlagsIsLoaded()
  const [, setShouldDisableNFTRoutes] = useAtom(shouldDisableNFTRoutesAtom)

  const location = useLocation()
  const { pathname } = location
  const currentPage = getCurrentPageFromLocation(pathname)

  const [scrollY, setScrollY] = useState(0)
  const scrolledState = scrollY > 0

  const routerConfig = useRouterConfig()

  const originCountry = useAppSelector((state: AppState) => state.user.originCountry)
  const renderUkBannner = Boolean(originCountry) && originCountry === 'GB'

  useEffect(() => {
    window.scrollTo(0, 0)
    setScrollY(0)
  }, [pathname])

  const [searchParams] = useSearchParams()
  useEffect(() => {
    if (searchParams.get('disableNFTs') === 'true') {
      setShouldDisableNFTRoutes(true)
    } else if (searchParams.get('disableNFTs') === 'false') {
      setShouldDisableNFTRoutes(false)
    }
  }, [searchParams, setShouldDisableNFTRoutes])

  useEffect(() => {
    const scrollListener = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  const isBagExpanded = useBag((state) => state.bagExpanded)
  // const isHeaderTransparent = !scrolledState && !isBagExpanded
  const isHeaderTransparent = true

  const { account } = useWeb3React()
  const statsigUser: StatsigUser = useMemo(
    () => ({
      userID: getDeviceId(),
      customIDs: { address: account ?? '' },
    }),
    [account]
  )

  const shouldBlockPath = isPathBlocked(pathname)
  if (shouldBlockPath && pathname !== '/swap') {
    return <Navigate to="/swap" replace />
  }

  return (
    <ErrorBoundary>
      <DarkModeQueryParamReader />
      <Trace page={currentPage}>
        <UserPropertyUpdater />
        {renderUkBannner && <UkBanner />}
        {!hiddenBar && (
          <SmallStrip>
            <div>
              &#128680; MAKE SURE YOU BOOKMARK THIS LINK HTTPS://LONGKONG.WIN &#128680;{' '}
              <span onClick={() => setBarPosition()}>x</span>
            </div>
          </SmallStrip>
        )}
        <HeaderWrapper
          transparent={isHeaderTransparent}
          bannerIsVisible={renderUkBannner}
          barIsVisible={!hiddenBar}
          scrollY={scrollY}
        >
          {/* <NavBar blur={isHeaderTransparent} /> */}
          <NavBar blur={false} />
        </HeaderWrapper>
        <BodyWrapper bannerIsVisible={renderUkBannner} barIsVisible={!hiddenBar}>
          <LiveText bannerIsVisible={renderUkBannner} barIsVisible={!hiddenBar}>
            <span>Live</span>
            <span>${usdPrice}</span>
          </LiveText>
          <KingKongDiv src={KingKong} />
          <Suspense>
            <AppChrome />
          </Suspense>
          <Suspense fallback={<Loader />}>
            {isLoaded ? (
              <Routes>
                {routes.map((route: RouteDefinition) =>
                  route.enabled(routerConfig) ? (
                    <Route key={route.path} path={route.path} element={route.getElement(routerConfig)}>
                      {route.nestedPaths.map((nestedPath) => (
                        <Route path={nestedPath} key={`${route.path}/${nestedPath}`} />
                      ))}
                    </Route>
                  ) : null
                )}
              </Routes>
            ) : (
              <Loader />
            )}
          </Suspense>
          <NewsBarComponent />
        </BodyWrapper>
        <MobileBottomBar>
          <PageTabs />
        </MobileBottomBar>
      </Trace>
    </ErrorBoundary>
  )
}

function UserPropertyUpdater() {
  const isDarkMode = useIsDarkMode()

  const [routerPreference] = useRouterPreference()
  const userOptedOutOfUniswapX = useUserOptedOutOfUniswapX()
  const isUniswapXDefaultEnabled = useUniswapXDefaultEnabled()
  const { isLoading: isUniswapXDefaultLoading } = useGate(FeatureFlag.uniswapXDefaultEnabled)
  const rehydrated = useAppSelector((state) => state._persist.rehydrated)

  useEffect(() => {
    // User properties *must* be set before sending corresponding event properties,
    // so that the event contains the correct and up-to-date user properties.
    user.set(CustomUserProperties.USER_AGENT, navigator.userAgent)
    user.set(CustomUserProperties.BROWSER, getBrowser())
    user.set(CustomUserProperties.SCREEN_RESOLUTION_HEIGHT, window.screen.height)
    user.set(CustomUserProperties.SCREEN_RESOLUTION_WIDTH, window.screen.width)
    user.set(CustomUserProperties.GIT_COMMIT_HASH, process.env.REACT_APP_GIT_COMMIT_HASH ?? 'unknown')

    // Service Worker analytics
    const isServiceWorkerInstalled = Boolean(window.navigator.serviceWorker?.controller)
    const isServiceWorkerHit = Boolean((window as any).__isDocumentCached)
    const serviceWorkerProperty = isServiceWorkerInstalled ? (isServiceWorkerHit ? 'hit' : 'miss') : 'uninstalled'

    const pageLoadProperties = { service_worker: serviceWorkerProperty }
    sendInitializationEvent(SharedEventName.APP_LOADED, pageLoadProperties)
    const sendWebVital =
      (metric: string) =>
      ({ delta }: Metric) =>
        sendAnalyticsEvent(SharedEventName.WEB_VITALS, { ...pageLoadProperties, [metric]: delta })
    getCLS(sendWebVital('cumulative_layout_shift'))
    getFCP(sendWebVital('first_contentful_paint_ms'))
    getFID(sendWebVital('first_input_delay_ms'))
    getLCP(sendWebVital('largest_contentful_paint_ms'))
  }, [])

  useEffect(() => {
    user.set(CustomUserProperties.DARK_MODE, isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    if (isUniswapXDefaultLoading || !rehydrated) return

    // If we're not in the transition period to UniswapX opt-out, set the router preference to whatever is specified.
    if (!isUniswapXDefaultEnabled) {
      user.set(CustomUserProperties.ROUTER_PREFERENCE, routerPreference)
      return
    }

    // In the transition period, override the stored API preference to UniswapX if the user hasn't opted out.
    if (routerPreference === RouterPreference.API && !userOptedOutOfUniswapX) {
      user.set(CustomUserProperties.ROUTER_PREFERENCE, RouterPreference.X)
      return
    }

    // Otherwise, the user has opted out or their preference is UniswapX/client, so set the preference to whatever is specified.
    user.set(CustomUserProperties.ROUTER_PREFERENCE, routerPreference)
  }, [routerPreference, isUniswapXDefaultEnabled, userOptedOutOfUniswapX, isUniswapXDefaultLoading, rehydrated])
  return null
}
