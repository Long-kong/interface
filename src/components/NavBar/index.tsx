import KongLogo from 'assets/svg/kong_white.svg'
import { useAccountDrawer } from 'components/AccountDrawer'
import Web3Status from 'components/Web3Status'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useIsPoolsPage } from 'hooks/useIsPoolsPage'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import { ReactNode, useCallback } from 'react'
import { NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import { useToggleAffiliatesModal, useToggleSellModal } from 'state/application/hooks'
import styled from 'styled-components'

import { useIsNavSearchInputVisible } from '../../nft/hooks/useIsNavSearchInputVisible'
import { Bag } from './Bag'
import Blur from './Blur'
import * as styles from './style.css'

const Nav = styled.nav`
  padding: ${({ theme }) => `${theme.navVerticalPad}px 12px`};
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

const WhiteLogo = styled.img<{ height?: number | string; width?: number | string }>`
  height: ${({ height }) => (height ? height + 'px' : '100%')};
  width: ${({ width }) => (width ? width + 'px' : 'auto')};
  cursor: pointer;
`
const NoLink = styled.span`
  text-align: center;
  cursor: pointer;
  color: ${({ theme }) => theme.neutral2};
  padding-right: 14px;
  padding-left: 14px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
  transition: 250ms;
  border-radius: 14px;
  &:hover {
    background: #99a1bd14;
  }
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children }: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
      data-testid={dataTestId}
    >
      {children}
    </NavLink>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation()
  const isPoolActive = useIsPoolsPage()

  const toggleShowSellPopup = useToggleSellModal()
  const toggleShowAffiliatesPopup = useToggleAffiliatesModal()

  return (
    <>
      <MenuItem href="/" isActive={pathname.endsWith('/')}>
        Home
      </MenuItem>
      <MenuItem href="/swap" isActive={pathname.startsWith('/swap')}>
        Buy
      </MenuItem>
      <NoLink onClick={toggleShowSellPopup}>Sell</NoLink>
      <MenuItem href="/add/v2/ETH" dataTestId="pool-nav-link" isActive={isPoolActive}>
        Add Liquidity
      </MenuItem>
      <NoLink onClick={toggleShowAffiliatesPopup}>Leaderboard</NoLink>
    </>
  )
}

const Navbar = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()
  const isNavSearchInputVisible = useIsNavSearchInputVisible()

  const [accountDrawerOpen, toggleAccountDrawer] = useAccountDrawer()

  const handleUniIconClick = useCallback(() => {
    if (accountDrawerOpen) {
      toggleAccountDrawer()
    }
    navigate({
      pathname: '/',
      // search: '?intro=true',
    })
  }, [accountDrawerOpen, navigate, toggleAccountDrawer])

  return (
    <>
      {blur && <Blur />}
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              {/* <WhiteLogo src={KongLogo} width="auto" height="48" className={styles.logo} onClick={handleUniIconClick} /> */}
              {/* <UniIcon
                width="48"
                height="48"
                data-testid="uniswap-logo"
                className={styles.logo}
                onClick={handleUniIconClick}
              /> */}
            </Box>
            {/* {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )} */}
            <Row display={{ sm: 'none', lg: 'flex' }}>
              <PageTabs />
            </Row>
          </Box>
          <Box
            className={styles.searchContainer}
            {...(isNavSearchInputVisible && {
              display: 'flex',
            })}
          >
            <WhiteLogo src={KongLogo} onClick={handleUniIconClick} />
            {/* <SearchBar /> */}
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box position="relative" display={isNavSearchInputVisible ? 'none' : { sm: 'flex' }}>
                {/* <SearchBar /> */}
              </Box>
              {isNftPage && sellPageState !== ProfilePageStateType.LISTING && <Bag />}
              {/* {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  <ChainSelector />
                </Box>
              )} */}

              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
