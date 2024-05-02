import React, { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useModalIsOpen, useToggleAnnouncementsModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'
import { BREAKPOINTS } from 'theme'

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
  border-radius: 30px;
  outline: 0;
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 20px;
    text-align: center;
  }
  p {
    text-align: center;
    margin-top: 0;
    font-size: 14px;
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    padding: 30px 20px;
    border-radius: 35px;
    h1 {
      font-size: 27px;
    }
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

const PrimaryButton = styled.button`
  background: #04da57;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  padding: 10px 10px;
  color: white;
  width: 100%;
  cursor: pointer;
  margin-top: 15px;
  text-decoration: none;
  text-align: center;
  &:hover {
    background: #04bc4b;
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    font-size: 22px;
    padding: 20px 10px;
    margin-top: 30px;
    border-radius: 17px;
  }
`

const KongAvatar = styled.div`
  position: relative;
  background: radial-gradient(88.59% 88.59% at 21.78% 11.41%, #0637a5 0%, #001e63 100%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    width: 110px;
    height: 110px;
    img {
      width: 90px;
      height: 90px;
    }
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

const AnnouncementList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
`

const AnnouncementItem = styled.li`
  font-size: 13px;
  width: 100%;
  color: white;
  text-align: center;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 2px solid #3961ba;
  background: linear-gradient(95deg, rgba(57, 97, 186, 0.4) 47%, rgba(161, 190, 255, 0.4) 110%);
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    font-size: 15px;
    margin-bottom: 10px;
    padding: 10px 15px;
  }
`

const LiquidityButton = styled(Link)`
  background: #04da57;
  border-radius: 17px;
  border: none;
  font-size: 22px;
  padding: 20px 10px;
  color: white;
  width: 100%;
  cursor: pointer;
  margin-top: 30px;
  text-decoration: none;
  text-align: center;
  &:hover {
    background: #07cd54;
  }
`

export default function AnnouncementsPopup() {
  const open = useModalIsOpen(ApplicationModal.ANNOUNCEMENTS)
  const toggle = useToggleAnnouncementsModal()

  const setPopup = useCallback((): void => {
    if (!sessionStorage.getItem('popup')) {
      sessionStorage.setItem('popup', JSON.stringify(true))
      toggle()
    }
  }, [toggle])

  useEffect(() => {
    if (!sessionStorage.getItem('popup')) {
      toggle()
    }
    // the toggleShowClaimPopup function changes every time the popup changes, so this will cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {open && (
        <Popup>
          <PopupDialog>
            <PopupContent>
              <Close onClick={() => setPopup()}>
                <small>+</small>
              </Close>
              <KongAvatar>
                <img src={Avatar} />
              </KongAvatar>
              <h1>LONG KONG Announcement &#129421; &#129421; &#129421;</h1>
              <p>
                LONG KONG is a novel gamified concept that leverages the automated market-making system to reward the
                most loyal holders.
              </p>
              <p>
                The smart contract could mistakenly be labeled as a Honeypot because you cannot directly sell or
                transfer KONG. However you can indirectly sell or transfer the LP token.
              </p>
              <AnnouncementList>
                <AnnouncementItem>✅ Fair mint</AnnouncementItem>
                <AnnouncementItem>✅ Ownership renounced</AnnouncementItem>
                <AnnouncementItem>✅ NO pre-mine</AnnouncementItem>
                <AnnouncementItem>✅ NO buy/sell tax</AnnouncementItem>
                <AnnouncementItem>✅ NO Proxy Contract</AnnouncementItem>
                <AnnouncementItem>✅ NO DUMP/APE ONLY</AnnouncementItem>
              </AnnouncementList>
              <PrimaryButton onClick={() => setPopup()}>Got it &#128640;</PrimaryButton>
              {/* <LiquidityButton to="/add/v2" onClick={() => toggle()}>
                Add Liquidity &#128640;
              </LiquidityButton> */}
            </PopupContent>
          </PopupDialog>
        </Popup>
      )}
    </>
  )
}
