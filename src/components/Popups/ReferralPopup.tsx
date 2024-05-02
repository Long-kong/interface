import { useWeb3React } from '@web3-react/core'
import Copy from 'assets/svg/copy.svg'
import { ButtonOutlined, ButtonPrimary } from 'components/Button'
import Row from 'components/Row'
import Tooltip from 'components/Tooltip'
import { useAffiliateTimestamp } from 'hooks/useAffiliateTimestamp'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { useGetBlockNumber } from 'hooks/useGetBlockNumber'
import { useGetBootstrap } from 'hooks/useGetBootstrap'
import { useGetDeploymentTimestamp } from 'hooks/useGetDeploymentTimestamp'
import useLast from 'hooks/useLast'
import { useRegisterAffiliate } from 'hooks/useRegisterAffiliate'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useModalIsOpen, useToggleReferralModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useAppSelector } from 'state/hooks'
import styled from 'styled-components'
import { BREAKPOINTS } from 'theme'
import { shortenAddress } from 'utils'

import Avatar from '../../assets/svg/kong-avatar.svg'

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: block;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  transition: opacity 0.15s linear;
  background: rgba(20, 20, 20, 70%);
`

const PopupDialog = styled.div`
  position: relative;
  width: auto;
  margin: 1.75rem;
  pointer-events: none;
  @media screen and (min-width: ${BREAKPOINTS.sm}px) {
    max-width: 554px;
    margin-right: auto;
    margin-left: auto;
  }
`

const PopupContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: white;
  pointer-events: auto;
  background: radial-gradient(
    166.71% 94.97% at 17.66% 11.47%,
    rgba(6, 55, 165, 0.65) 53.56%,
    rgba(111, 155, 255, 0.65) 100%
  );
  background-clip: padding-box;
  border: none;
  border-radius: 35px;
  outline: 0;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 27px;
    text-align: center;
  }
  p {
    text-align: center;
    margin-bottom: 0;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    h1 {
      font-size: 37px;
    }
    button {
      border-radius: 17px;
      font-size: 22px;
      padding: 30px 10px;
    }
  }
`

const Close = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #acc6ff;
  padding: 10px;
  background: #001c5c;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transform: rotate(45deg);
  margin-left: auto;
  cursor: pointer;
  small {
    font-size: 50px;
    line-height: 30px;
    position: relative;
    left: 0px;
    top: -3px;
    cursor: pointer;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    padding: 10px;
    width: 50px;
    height: 50px;
    small {
      font-size: 50px;
      line-height: 30px;
      left: 0px;
      top: -3px;
    }
  }
`

const KongAvatar = styled.div`
  position: relative;
  background: radial-gradient(88.59% 88.59% at 21.78% 11.41%, #0637a5 0%, #001e63 100%);
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    width: 240px;
    height: 240px;
    img {
      width: auto;
      height: auto;
    }
  }
`

const SimpleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`

const IconWrapper = styled.div<{ size?: number }>`
  align-items: center;
  justify-content: center;
  line-height: 10px;
  & > img,
  span {
    height: 14px;
    width: 14px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    & > img,
    span {
      height: ${({ size }) => (size ? size + 'px' : '24px')};
      width: ${({ size }) => (size ? size + 'px' : '24px')};
    }
  }
`

const Countdown = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 5px;
`

const Time = styled.div`
  display: flex;
  position: relative;
  gap: 5px;
`

export default function ReferralPopup() {
  const open = useModalIsOpen(ApplicationModal.REFERRAL)
  const toggle = useToggleReferralModal()
  const switchingChain = useAppSelector((state) => state.wallets.switchingChain)
  const ignoreWhileSwitchingChain = useCallback(() => !switchingChain, [switchingChain])
  const activeWeb3 = useWeb3React()
  const lastWeb3 = useLast(useWeb3React(), ignoreWhileSwitchingChain)
  const { account, connector } = useMemo(() => (activeWeb3.account ? activeWeb3 : lastWeb3), [activeWeb3, lastWeb3])

  const refUrl = window.location.host + '?ref='
  const [copyText, setCopyText] = useState(refUrl)
  const [isCopied, staticCopy] = useCopyClipboard()

  const [affiliateTimestamp, setAffiliateTimestamp] = useState<number>(0)
  const [blockTimestamp, setBlockTimestamp] = useState<number>(0)
  const [inBootstrap, setInBootstrap] = useState<boolean>()
  const [deploymentTimestamp, setDeploymentTimestamp] = useState<number>()

  const getAffiliateTimestamp = useAffiliateTimestamp(account)
  const getBlockNumber = useGetBlockNumber()
  const getBootstrap = useGetBootstrap()
  const getDeploymentTimestamp = useGetDeploymentTimestamp()

  useEffect(() => {
    if (account) {
      setCopyText(refUrl + account)
    }

    if (open) {
      getDeploymentTimestamp().then((timestamp) => {
        setDeploymentTimestamp(timestamp)
        return timestamp
      })

      getAffiliateTimestamp().then((timestamp) => {
        console.log('affiliateTimestamp', timestamp.toNumber())
        setAffiliateTimestamp(timestamp.toNumber())
        return timestamp
      })

      getBlockNumber().then((block) => {
        console.log('block', block.timestamp)
        setBlockTimestamp(block.timestamp)
        return block
      })

      getBootstrap().then((bootstrap) => {
        setInBootstrap(bootstrap)
        return bootstrap
      })
    }
  }, [
    account,
    refUrl,
    affiliateTimestamp,
    blockTimestamp,
    inBootstrap,
    open,
    getAffiliateTimestamp,
    getBlockNumber,
    getBootstrap,
    getDeploymentTimestamp,
  ])

  const registerAffiliate = useRegisterAffiliate()
  const registerAffiliateInstant = useRegisterAffiliate(true)

  const SECOND = 1
  const MINUTE = SECOND * 60
  const HOUR = MINUTE * 60
  const DAY = HOUR * 24
  const intervalRef = useRef<any>()
  const [time, setTime] = useState(affiliateTimestamp - blockTimestamp)

  useEffect(() => {
    if (open) {
      intervalRef.current = setInterval(() => {
        setTime(affiliateTimestamp - blockTimestamp)
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [affiliateTimestamp, blockTimestamp, open, time])

  return (
    <>
      {open && (
        <Popup>
          <PopupDialog>
            <PopupContent>
              <Close onClick={() => toggle()}>
                <small>+</small>
              </Close>
              <KongAvatar>
                <img src={Avatar} />
              </KongAvatar>
              <h1>Create your own referral link</h1>
              {affiliateTimestamp === 0 ? (
                inBootstrap ? (
                  <>
                    <p>
                      Adding liquidity during FREE MINT will automatically set your address as an active paid affiliate.
                    </p>
                    <p>Register after FREE MINT</p>
                  </>
                ) : (
                  <>
                    <p>Create your referral link. You have 2 options:</p>
                    <p>
                      1. Paid registration costs 0.1 ETH + gas fees. It becomes active immediately after purchase.
                      Eligible for up to 15% affiliate rewards.
                    </p>
                    <p>
                      2. Free registration costs only the gas fees. The link will become active after 1 cycle. Once
                      active, it will be eligible for 5% affiliate rewards.
                    </p>
                    <Row width="100%" gap="10px">
                      <ButtonPrimary
                        onClick={() => registerAffiliateInstant().then(() => toggle())}
                        fontSize="14px"
                        padding="10px"
                        width="100%"
                        $borderRadius="5px"
                        mt="1rem"
                      >
                        Register instant
                      </ButtonPrimary>
                      <ButtonOutlined
                        onClick={() => registerAffiliate().then(() => toggle())}
                        fontSize="14px"
                        padding="10px"
                        width="100%"
                        $borderRadius="5px"
                        mt="1rem"
                      >
                        Register free
                      </ButtonOutlined>
                    </Row>
                  </>
                )
              ) : affiliateTimestamp !== undefined &&
                blockTimestamp !== undefined &&
                affiliateTimestamp < blockTimestamp ? (
                <>
                  <p>Referral link active. You cannot use your own referral link.</p>
                  <p>
                    {refUrl}
                    {shortenAddress(account)}
                    <SimpleButton
                      onClick={() => {
                        staticCopy(copyText)
                      }}
                    >
                      <Tooltip text="Copied" show={isCopied}>
                        <IconWrapper size={12}>
                          <img src={Copy} alt="Icon" />
                        </IconWrapper>
                      </Tooltip>
                    </SimpleButton>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    You have selected free registration with 5% affiliate rewards. The affiliate is currently inactive.
                    It will become active in:
                    <Countdown>
                      {Object.entries({
                        Days: time / DAY,
                        Hours: (time / HOUR) % 24,
                        Minutes: (time / MINUTE) % 60,
                        Seconds: (time / SECOND) % 60,
                      }).map(([label, value]) => (
                        <Time key={label}>
                          <span>{`${time > 0 ? Math.floor(value) : 0}`.padStart(2, '0')}</span>
                          <span>{label}</span>
                        </Time>
                      ))}
                    </Countdown>
                  </p>
                  <Row width="100%" gap="10px">
                    <ButtonPrimary
                      onClick={() => registerAffiliateInstant().then(() => toggle())}
                      fontSize="14px"
                      padding="10px"
                      width="100%"
                      $borderRadius="5px"
                      mt="1rem"
                    >
                      Register instant
                    </ButtonPrimary>
                  </Row>
                </>
              )}
            </PopupContent>
          </PopupDialog>
        </Popup>
      )}
    </>
  )
}
