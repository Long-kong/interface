import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { CycleTimer } from 'components/CycleTimer/CycleTimer'
import { ZERO_ADDRESS } from 'constants/misc'
import { useGetCycleStats } from 'hooks/useGetCycleStats'
import { useGetCycleWinners } from 'hooks/useGetCycleWinners'
import { useGetWethBalance } from 'hooks/useGetWethBalance'
import React, { useEffect, useState } from 'react'
import { useModalIsOpen, useToggleAffiliatesModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'
import { BREAKPOINTS } from 'theme'
import { shortenAddress } from 'utils'

import Hourglass from '../../assets/images/hourglass.png'
import Trophy from '../../assets/images/trophy.png'

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
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    max-width: 1042px;
    margin-right: auto;
    margin-left: auto;
  }
`
const AffiliateList = styled.div<{ small?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  h2 {
    ${({ small }) => (small ? 'font-size: 14px;' : 'font-size: 20px;')}
  }
  h1 {
    ${({ small }) => (small ? 'font-size: 13px;' : 'font-size: 22px;')}
    margin: 0 0 0 15px;
    text-align: left;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    h2 {
      ${({ small }) => (small ? 'font-size: 17px;' : 'font-size: 23px;')}
    }
    h1 {
      ${({ small }) => (small ? 'font-size: 16px;' : 'font-size: 26px;')}
      margin: 0 0 0 15px;
      text-align: left;
    }
  }
`
const AffiliateBoxes = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 25px;
  margin-top: 10px;
  @media screen and (min-width: ${BREAKPOINTS.sm}px) {
    flex-direction: row;
  }
`
const AffiliateNo = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  padding-top: 15px;
`
const Position = styled.h2`
  text-align: center;
`
const AffiliateBox = styled.div<{ small?: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  color: white;
  pointer-events: auto;
  border: none;
  border-radius: 30px;
  outline: 0;
  padding: 25px 15px;
  justify-content: space-between;
  gap: 10px;
  background-clip: padding-box;
  ${({ small }) =>
    small
      ? 'background: #03060D;'
      : 'background: radial-gradient(166.71% 94.97% at 17.66% 11.47%, rgba(6, 55, 165, 0.65) 53.56%, rgba(111, 155, 255, 0.65) 100%);'};
  img {
    width: 46px;
    height: auto;
  }
  h2 {
    margin: 0 0 10px 0;
  }
`
const PopupContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: white;
  pointer-events: auto;
  background: #090e19;
  background-clip: padding-box;
  border: none;
  border-radius: 30px;
  outline: 0;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    text-align: center;
    margin-top: 0;
    font-size: 14px;
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    padding: 30px 20px;
    border-radius: 35px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
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

const AnnouncementList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
`

const AnnouncementItem = styled.li<{ small?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  width: 100%;
  color: white;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  ${({ small }) => (small ? 'border: 1px solid #03060D;' : 'border: 2px solid #3961ba;')};
  ${({ small }) =>
    small
      ? 'background: #090E19'
      : 'background: linear-gradient(95deg, rgba(57, 97, 186, 0.4) 47%, rgba(161, 190, 255, 0.4) 110%);'};
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    font-size: 15px;
    margin-bottom: 10px;
    padding: 10px 15px;
  }
`

const CycleTitle = styled.h1`
  display: flex;
  gap: 10px;
  font-size: 22px;
  text-align: center;
  margin: 15px 0;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 24px;
  }
`

export default function AffiliatesPopup() {
  const open = useModalIsOpen(ApplicationModal.AFFILIATES)
  const toggle = useToggleAffiliatesModal()

  const [cycleStats, setCycleStatus] = useState<any>()
  const [cycleWinners, setCycleWinners] = useState<any[]>()
  const [wethBalance, setWethBalance] = useState<BigNumber>()

  const getCycleStats = useGetCycleStats()
  const getCycleWinners = useGetCycleWinners()
  const getWethBalance = useGetWethBalance()

  useEffect(() => {
    if (open) {
      getWethBalance().then((balance) => {
        setWethBalance(balance)
        return balance
      })

      getCycleStats()
        .then((stats) => {
          setCycleStatus(stats)
          return stats
        })
        .then((stats: any) => {
          /** REMOVE stats.index < 10 condition for limit > 10 */
          if (stats.index.toNumber() > 1) {
            const promises: any[] = []
            const limit = stats.index.toNumber() < 10 ? 0 : stats.index.toNumber() - 10

            for (let i = stats.index.toNumber() - 1; i > limit; i--) {
              promises.push(getCycleWinners(i))
            }
            return Promise.all(promises)
          }
          return getCycleWinners(1)
        })
        .then((winners: any) => {
          if (winners) {
            setCycleWinners(winners)
          }
        })
    }
  }, [open, getCycleStats, getCycleWinners, getWethBalance])

  return (
    <>
      {open && (
        <Popup>
          <PopupDialog>
            <PopupContent>
              <Close onClick={() => toggle()}>
                <small>+</small>
              </Close>
              {cycleStats && (
                <AffiliateBoxes>
                  <AffiliateBox>
                    <AffiliateNo>
                      <img src={Trophy} />
                      <Position>#1</Position>
                    </AffiliateNo>
                    <AffiliateList>
                      <h2>Affiliates nominee</h2>
                      <AnnouncementList>
                        <AnnouncementItem>{shortenAddress(cycleStats?.topAffiliate)}</AnnouncementItem>
                        <AnnouncementItem>
                          Beat this to win{' '}
                          <strong>{formatEther(cycleStats?.topAffiliateEarnings).toString()} ETH</strong>
                        </AnnouncementItem>
                      </AnnouncementList>
                      <h1>Prize {wethBalance && formatEther(wethBalance.div(2)).toString()} ETH</h1>
                    </AffiliateList>
                  </AffiliateBox>
                  <AffiliateBox>
                    <AffiliateNo>
                      <img src={Trophy} />
                      <Position>#1</Position>
                    </AffiliateNo>
                    <AffiliateList>
                      <h2>Buyers nominee</h2>
                      <AnnouncementList>
                        <AnnouncementItem>{shortenAddress(cycleStats?.topBuyer)}</AnnouncementItem>
                        <AnnouncementItem>
                          Beat this to win <strong>{formatEther(cycleStats?.topTotalBuyAmount).toString()} ETH</strong>
                        </AnnouncementItem>
                      </AnnouncementList>
                      <h1>Prize {wethBalance && formatEther(wethBalance.div(2)).toString()} ETH</h1>
                    </AffiliateList>
                  </AffiliateBox>
                </AffiliateBoxes>
              )}
              <CycleTitle>
                <img src={Hourglass} alt="hourglass" />
                <span>Cycle ends in:</span>
                <img src={Hourglass} alt="hourglass" />
              </CycleTitle>
              <CycleTimer />
              {cycleWinners &&
                cycleWinners.length > 0 &&
                cycleWinners.map((winner, index) => (
                  <AffiliateBoxes key={index}>
                    <AffiliateBox small>
                      <AffiliateNo>
                        <img src={Trophy} />
                        <Position>#1</Position>
                      </AffiliateNo>
                      <AffiliateList small>
                        <h2>Cycle {cycleStats.index - 1 - index} Affiliate winner</h2>
                        <AnnouncementList>
                          <AnnouncementItem small>
                            {shortenAddress(winner.topAffiliate)}
                            <strong>{formatEther(winner.topAffiliateEarnings).toString()} ETH</strong>
                          </AnnouncementItem>
                        </AnnouncementList>
                        {winner.topAffiliate === ZERO_ADDRESS ? (
                          <h1>No winner</h1>
                        ) : (
                          <h1>Won {formatEther(winner.affiliatePrize).toString()} ETH</h1>
                        )}
                      </AffiliateList>
                    </AffiliateBox>
                    <AffiliateBox small>
                      <AffiliateNo>
                        <img src={Trophy} />
                        <Position>#1</Position>
                      </AffiliateNo>
                      <AffiliateList small>
                        <h2>Cycle {cycleStats.index - 1 - index} Buyers winner</h2>
                        <AnnouncementList>
                          <AnnouncementItem small>
                            {shortenAddress(winner.topBuyer)}
                            <strong>{formatEther(winner.topTotalBuyAmount).toString()} ETH</strong>
                          </AnnouncementItem>
                        </AnnouncementList>
                        {winner.topBuyer === ZERO_ADDRESS ? (
                          <h1>No winner</h1>
                        ) : (
                          <h1>Won {formatEther(winner.buyerPrize).toString()} ETH</h1>
                        )}
                      </AffiliateList>
                    </AffiliateBox>
                  </AffiliateBoxes>
                ))}
            </PopupContent>
          </PopupDialog>
        </Popup>
      )}
    </>
  )
}
