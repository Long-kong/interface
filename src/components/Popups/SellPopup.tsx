import React from 'react'
import { useModalIsOpen, useToggleSellModal } from 'state/application/hooks'
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

export default function SellPopup() {
  const open = useModalIsOpen(ApplicationModal.SELL)
  const toggle = useToggleSellModal()

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
              <h1>How to sell</h1>
              <p>
                LONG KONG is a novel concept that leverages the AMM system to reward the most patient participants with
                the best possible exit strategy.
              </p>
              <p>
                The contract is mistakenly labelled as a Honeypot because you cannot directly sell or transfer $KONG.
                However you can indirectly sell or transfer by wrapping the LP token.
              </p>
              <PrimaryButton onClick={() => toggle()}>Got it &#128640;</PrimaryButton>
            </PopupContent>
          </PopupDialog>
        </Popup>
      )}
    </>
  )
}
