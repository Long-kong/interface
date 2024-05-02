import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import EmojiBanana from 'assets/images/emoji_banana.png'
import EmojiMoney from 'assets/images/emoji_money.png'
import { useAccountDrawer } from 'components/AccountDrawer'
import { ButtonLight } from 'components/Button'
import { IconWrapper } from 'components/Identicon/StatusIcon'
import { Notification } from 'components/Notification/Notification'
import { RowFixed } from 'components/Row'
import { CONTRACT_ADDRESS, ZERO_ADDRESS } from 'constants/misc'
import { KONG_MAINNET } from 'constants/tokens'
import { useAffiliateTimestamp } from 'hooks/useAffiliateTimestamp'
import { useGetBlockNumber } from 'hooks/useGetBlockNumber'
import { useGetBonuses } from 'hooks/useGetBonuses'
import { useGetBootstrap } from 'hooks/useGetBootstrap'
import { useGetCycle } from 'hooks/useGetCycle'
import { useGetReferral } from 'hooks/useGetReferral'
import { useGetWethUsdtPrice } from 'hooks/useGetWethUsdtPrice'
import useLast from 'hooks/useLast'
import useCurrencyLogoURIs from 'lib/hooks/useCurrencyLogoURIs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToggleReferralModal } from 'state/application/hooks'
import { useAppSelector } from 'state/hooks'
import styled, { css } from 'styled-components'
import { useTheme } from 'styled-components'
import { BREAKPOINTS } from 'theme'

import Diamond from '../../assets/svg/diamond.svg'
import DiamondBg from '../../assets/svg/diamond-bg.svg'
import Money from '../../assets/svg/money.svg'
import MoneyBg from '../../assets/svg/money-bg.svg'
import { Timer } from '../CountdownTimer/CountdownTimer'

const MainView = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #1b202b;
  background-color: #090e19;
  border-radius: 7px;
  position: relative;
  color: white;
  max-width: 480px;
  width: 100%;
  padding: 10px 14px;
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    padding: 22px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    max-width: 640px;
    padding: 30px 44px;
  }
`

const MainHeader = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    margin-bottom: 15px;
  }
`

const MainTitle = styled.h3`
  font-size: 14px;
  text-transform: uppercase;
  margin: 0 0 10px;
  text-align: center;
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    font-size: 18px;
    margin: 0 0 15px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 22px;
    margin: 0 0 20px;
  }
`

const SmallTitle = styled.h4`
  font-size: 16px;
  color: white;
  text-transform: uppercase;
  margin: 10px 0;
  text-align: center;
`

const CommercialButton = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const CommercialTitle = styled.div<{ color?: string }>`
  position: relative;
  ${(props) => {
    switch (props.color) {
      case 'blue':
        return css`
          background-color: #005ac2;
        `
      case 'orange':
        return css`
          background-color: #f9c700;
        `
      default:
        return css`
          background-color: #0542d1;
        `
    }
  }};
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 7px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  ${(props) => {
    switch (props.color) {
      case 'blue':
        return css`
          background-image: url(${DiamondBg});
        `
      case 'orange':
        return css`
          background-image: url(${MoneyBg});
        `
      default:
        return null
    }
  }};
  background-repeat: no-repeat;
  background-position: bottom center;
  &:before {
    ${(props) => {
      switch (props.color) {
        case 'blue':
          return css`
            content: '';
            background: url(${Diamond});
          `
        case 'orange':
          return css`
            content: '';
            background: url(${Money});
          `
        default:
          return null
      }
    }};
    background-size: cover;
    background-repeat: no-repeat;
    width: 44px;
    height: 41px;
    position: relative;
    margin-bottom: -10px;
    margin-top: -10px;
    margin-left: -10px;
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    font-size: 14px;

    ${(props) => {
      switch (props.color) {
        case 'blue':
          return css`
            padding: 18px 15px 10px;
            background-image: url(${DiamondBg});
          `
        case 'orange':
          return css`
            padding: 18px 15px 10px;
            background-image: url(${MoneyBg});
          `
        default:
          return `
          padding: 10px 12px 7px;
          `
      }
    }};
    &:before {
      width: 54px;
      height: 51px;
      margin-bottom: -15px;
      margin-top: -15px;
      margin-left: -15px;
    }
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 20px;
    padding: 15px 15px 10px;
    &:before {
      width: 64px;
      height: 65px;
      margin-bottom: -25px;
      margin-top: -15px;
      margin-left: -15px;
    }
  }
`

const CommercialLink = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #131f3a;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  padding: 10px 12px 7px;
  span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 5px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 10px;
    small {
      display: inline-block;
      border: 1px solid white;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      line-height: 14px;
    }
  }
  button,
  a {
    background: none;
    border: none;
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    flex-shrink: 0;
    span {
      &:first-child {
        text-decoration: underline;
      }
      &:last-child {
        height: 6px;
        line-height: 2px;
        font-size: 10px;
      }
    }
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    span {
      font-size: 13px;
    }
    button,
    a {
      span {
        &:last-child {
          font-size: 13px;
        }
      }
    }
    a {
      gap: 4px;
      span {
        font-size: 8px;
      }
    }
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    span {
      font-size: 17px;
    }
    a {
      gap: 6px;
      span {
        font-size: 10px;
      }
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
  margin-bottom: 15px;
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    gap: 15px;
    margin-top: 20px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    margin-top: 57px;
    margin-bottom: 25px;
  }
`

const Action = styled(Link)<{ color: string }>`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  background: ${(props) => (props.color === 'green' ? '#00C618' : '#FF1E2C')};
  border-radius: 5px;
  box-shadow: 0 15px ${(props) => (props.color === 'green' ? '#047D12' : '#931820')};
  border: none;
  cursor: pointer;
  width: 100%;
  line-height: 1;
  padding: 10px;
  text-decoration: none;
  &:hover {
    background: ${(props) => (props.color === 'green' ? '#0dd725' : '#fb4651')};
  }
  &:active {
    background: ${(props) => (props.color === 'green' ? '#00C618' : '#FF1E2C')};
    box-shadow: 0 11px ${(props) => (props.color === 'green' ? '#047D12' : '#931820')};
    transform: translateY(4px);
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    font-size: 22px;
    padding: 16px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 30px;
    padding: 26px;
    box-shadow: 0 25px ${(props) => (props.color === 'green' ? '#047D12' : '#931820')};
    &:active {
      box-shadow: 0 15px ${(props) => (props.color === 'green' ? '#047D12' : '#931820')};
      transform: translateY(10px);
    }
  }
`

const TooltipText = styled.div`
  visibility: hidden;
  width: 200px;
  font-size: 11px;
  background-color: #282828;
  color: #fff;
  text-transform: none;
  font-weight: 400;
  text-align: center;
  padding: 5px 3px;
  border-radius: 4px;

  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  margin-left: -100px;
`

const Tooltip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover ${TooltipText} {
    visibility: visible;
  }
`

const TooltipRound = styled(Tooltip)`
  border: 1px solid white;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  line-height: 14px;
  font-size: 12px;
  flex-shrink: 0;
`

const ReferralLink = styled.p`
  margin: 0 0 10px;
  text-align: center;
  a {
    color: white;
  }
`

const TextWithIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`

export function MainViewComponent() {
  const switchingChain = useAppSelector((state) => state.wallets.switchingChain)
  const ignoreWhileSwitchingChain = useCallback(() => !switchingChain, [switchingChain])
  const activeWeb3 = useWeb3React()
  const { connector } = useWeb3React()
  const lastWeb3 = useLast(useWeb3React(), ignoreWhileSwitchingChain)
  const { account, provider } = useMemo(() => (activeWeb3.account ? activeWeb3 : lastWeb3), [activeWeb3, lastWeb3])

  const theme = useTheme()

  const [, toggleAccountDrawer] = useAccountDrawer()
  const handleWalletDropdownClick = useCallback(async () => {
    toggleAccountDrawer()
  }, [toggleAccountDrawer])

  const toggleShowRefferalPopup = useToggleReferralModal()

  const [affiliateTimestamp, setAffiliateTimestamp] = useState<number>()
  const [blockTimestamp, setBlockTimestamp] = useState<number>()

  const getBlockNumber = useGetBlockNumber()

  const [notification, setNotification] = useState({ show: false, msg: '' })

  const displayNotification = (msg: string) => {
    setNotification({ show: true, msg })
  }

  const hideNotification = () => {
    setNotification({ show: false, msg: '' })
  }

  const now = new Date()
  const current = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const getBonuses = useGetBonuses()
  const getWeth = useGetWethUsdtPrice()
  const getBootstrap = useGetBootstrap()
  const getCycle = useGetCycle()
  const getReferral = useGetReferral()

  const [bonuses, setBonuses] = useState<{ bonuses: BigNumber | null; nextBonuses: BigNumber | null }>({
    bonuses: null,
    nextBonuses: null,
  })
  const [usdPrice, setUsdPrice] = useState(0)
  const [inBootstrap, setInBootstrap] = useState<boolean>()
  const [currentCycle, setCurrentCycle] = useState<BigNumber>()
  const [existingReferral, setExistingReferral] = useState<string>()

  const searchParams = new URLSearchParams(document.location.search)
  const referral = searchParams.get('ref')

  const getAffiliateTimestamp = useAffiliateTimestamp(referral)

  useEffect(() => {
    getBonuses().then((allBonuses: { bonuses: BigNumber | null; nextBonuses: BigNumber | null }) => {
      setBonuses(allBonuses)
      return allBonuses
    })

    getWeth().then((usd) => {
      setUsdPrice(usd)
      return usd
    })

    getBootstrap().then((bootstrap) => {
      setInBootstrap(bootstrap)
      return bootstrap
    })

    getCycle().then((cycle) => {
      setCurrentCycle(cycle)
      return cycle
    })

    getReferral().then((referral) => {
      setExistingReferral(referral)
      return referral
    })

    // getAffiliateTimestamp().then((timestamp) => {
    //   setAffiliateTimestamp(timestamp.toNumber())
    //   return timestamp
    // })

    if (referral) {
      getAffiliateTimestamp().then((timestamp) => {
        setAffiliateTimestamp(timestamp.toNumber())
        return timestamp
      })
    }

    getBlockNumber().then((block) => {
      setBlockTimestamp(block?.timestamp)
      return block
    })
  }, [getBonuses, getWeth, getBootstrap, getCycle, getReferral, getAffiliateTimestamp, getBlockNumber, referral])

  useEffect(() => {
    if (referral && account) {
      if (!localStorage.getItem('referral')) {
        if (
          affiliateTimestamp &&
          blockTimestamp &&
          referral != account &&
          0 < affiliateTimestamp &&
          affiliateTimestamp < blockTimestamp
        ) {
          localStorage.setItem('referral', referral)
          hideNotification()
        } else if (affiliateTimestamp == 0) {
          displayNotification(
            "<b>Invalid referral</b><p>The address you're trying to use is not registered as a referral</p>"
          )
        } else if (affiliateTimestamp && blockTimestamp && affiliateTimestamp >= blockTimestamp) {
          displayNotification(
            "<b>Invalid referral</b><p>The address you're trying to use registered as a referral, but it's not yet active</p>"
          )
        } else if (referral == account) {
          displayNotification("<b>Invalid referral</b><p>Can't use your own referral address</p>")
        } else {
          displayNotification('<b>Invalid referral</b>')
        }
      } else if (existingReferral) {
        // do nothing
      } else if (localStorage.getItem('referral')) {
        // do nothing
      } else {
        // do nothing
      }
    } else if (referral) {
      displayNotification('<b>Unable to use referral</b><p>Connect your wallet first to use a referral</p>')
    }

    console.log('referral', referral)
    console.log("localStorage.getItem('referral')", localStorage.getItem('referral'))
    console.log('affiliateTimestamp', affiliateTimestamp)
    console.log('blockTimestamp', blockTimestamp)
  }, [
    getReferral,
    getAffiliateTimestamp,
    getBlockNumber,
    affiliateTimestamp,
    blockTimestamp,
    account,
    existingReferral,
    referral,
  ])

  const token = KONG_MAINNET
  const logoURL = useCurrencyLogoURIs(token)[0]

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (!token?.symbol || !connector.watchAsset) return
    connector
      .watchAsset({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: logoURL,
      })
      .then(() => {
        setSuccess(true)
        if (account) {
          localStorage.setItem('kong-token', account)
        }
      })
      .catch(() => setSuccess(false))
  }, [connector, logoURL, token, account])

  useEffect(() => {
    if (localStorage.getItem('kong-token') && localStorage.getItem('kong-token') === account) {
      setSuccess(true)
    }
  }, [setSuccess, account])

  const updateParent = useCallback(() => {
    getBonuses().then((allBonuses: { bonuses: BigNumber | null; nextBonuses: BigNumber | null }) => {
      setBonuses(allBonuses)
      return allBonuses
    })
  }, [getBonuses])

  return (
    <MainView>
      {notification.show && <Notification message={notification.msg} handleClick={hideNotification} />}

      {(!existingReferral || existingReferral === ZERO_ADDRESS) && (
        <ReferralLink>
          ❌ Missing referral link ❌ <br />
          <a href="https://x.com/hashtag/LONGKONG" target="_blank">Click here to find a referral link for 2X BONUS</a>
        </ReferralLink>
      )}
      <MainHeader>
        <CommercialButton>
          <CommercialTitle color="orange">2x every 2 weeks</CommercialTitle>
          <CommercialLink>
            <span>
              bonus
              <TooltipRound>
                &#63;
                <TooltipText>
                  A cycle lasts for 2 weeks. If you buy KONG in the current cycle, you are eligible to claim 2X bonus in
                  KONG in the next cycle. For example, if you buy 1000 KONG in cycle 3, you are eligible to claim a
                  bonus of 2000 KONG in cycle 4.
                </TooltipText>
              </TooltipRound>
            </span>
            <button>
              <Link to="/swap">
                <span>Get bonus</span>
              </Link>
            </button>
          </CommercialLink>
        </CommercialButton>
        <CommercialButton>
          <CommercialTitle color="blue">15% referral</CommercialTitle>
          <CommercialLink>
            <span>
              refferal{' '}
              <TooltipRound>
                &#63;
                <TooltipText>
                  The affiliate starts at 5% for all registered affiliates and goes up to 15% in ETH for paid affiliates based on their performance. The referral code is stored in the
                  smart contract forever, meaning that you will get paid each time a user buys using your referral link.
                  For example, if a user buys $1000 worth of KONG using your referral code, you will get up to $150
                  worth of ETH. For using the referral link, the user also gets a 2x bonus in KONG.
                </TooltipText>
              </TooltipRound>
            </span>
            <button onClick={account ? toggleShowRefferalPopup : handleWalletDropdownClick}>
              <span>create link</span>
            </button>
          </CommercialLink>
        </CommercialButton>
      </MainHeader>
      <MainHeader>
        <CommercialButton>
          <CommercialTitle>Unclaimed bonus</CommercialTitle>
          <CommercialLink>
            <span>
              {bonuses.bonuses && bonuses.bonuses.toNumber()} $KONG
              <br />
              {bonuses.bonuses && (bonuses.bonuses.toNumber() * usdPrice).toFixed(2)} USD
              <TooltipRound>
                &#63;
                <TooltipText>
                  If you buy KONG during this cycle, you will get this amount of extra KONG as bonus.
                </TooltipText>
              </TooltipRound>
            </span>
          </CommercialLink>
        </CommercialButton>
        <CommercialButton>
          <CommercialTitle>Next bonus</CommercialTitle>
          <CommercialLink>
            <span>
              {bonuses.nextBonuses && bonuses.nextBonuses.toNumber()} $KONG
              <br />
              {bonuses.nextBonuses && (bonuses.nextBonuses.toNumber() * usdPrice).toFixed(2)} USD
              <TooltipRound>
                &#63;
                <TooltipText>
                  The amount of KONG you are able to claim in the next cycle. Buy more KONG during this cycle to
                  increase your bonus.
                </TooltipText>
              </TooltipRound>
            </span>
          </CommercialLink>
        </CommercialButton>
      </MainHeader>
      {(inBootstrap || currentCycle) && (
        <>
          <MainTitle>
            {inBootstrap ? 'FREE MINT ends in:' : 'Current cycle is ' + currentCycle + '. Next cycle starts in:'}
          </MainTitle>
          <Timer setTimerFinished={updateParent} />
        </>
      )}
      {/* <SmallTitle>Next cycle starts in: </SmallTitle> */}
      <ActionButtons>
        <Action color="red" to={`/remove/v2/${CONTRACT_ADDRESS}/ETH`}>
          <TextWithIcon>
            flee
            <IconWrapper size={26}>
              <img src={EmojiMoney} alt="emoji money" />
            </IconWrapper>
            <TooltipRound>
              &#63;
              <TooltipText>
                Flee is the action of removing liquidity, which means converting the LP token back to ETH and KONG,
                assuming you've already added liquidity.
              </TooltipText>
            </TooltipRound>
          </TextWithIcon>
        </Action>
        {inBootstrap ? (
          <Action color="green" to="/add/v2/ETH">
            <TextWithIcon>add liquidity</TextWithIcon>
          </Action>
        ) : (
          <Action color="green" to="/swap">
            <TextWithIcon>
              feed
              <IconWrapper size={26}>
                <img src={EmojiBanana} alt="emoji banana" />
              </IconWrapper>
              <TooltipRound>
                &#63;
                <TooltipText>Feed is the action of buying KONG for the purpose of adding liquidity.</TooltipText>
              </TooltipRound>
            </TextWithIcon>
          </Action>
        )}
      </ActionButtons>
      {connector.watchAsset &&
        (success ?? (
          <ButtonLight mt="10px" padding="6px 12px" width="full" onClick={addToken}>
            <RowFixed>
              <Trans>Add {KONG_MAINNET.symbol}</Trans>
            </RowFixed>
          </ButtonLight>
        ))}
    </MainView>
  )
}
