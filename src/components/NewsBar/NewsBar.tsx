import Banana from 'assets/images/banana.png'
import EmojiDollarFace from 'assets/images/emoji_dollar_face.png'
import EmojiKong from 'assets/images/emoji_kong.png'
import Copy from 'assets/svg/copy.svg'
import { GithubIcon } from 'components/About/Icons'
import RSSFeed from 'components/RSSFeed/RSSFeed'
import Tooltip from 'components/Tooltip'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { ContainerTemplate } from 'pages/Landing'
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { BREAKPOINTS } from 'theme'

const NewsBar = styled(ContainerTemplate)`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: auto;
`

const NewsGroup = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: auto;
`

const BananaTv = styled.div`
  display: flex;
  flex-direction: column;
  background: #252525;
  width: 96px;
  height: 100px;
  justify-content: space-between;
  align-items: center;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    width: 160px;
    height: 168px;
  }
`

const BananaTvTitle = styled.div`
  display: flex;
  font-size: 13px;
  font-weight: bold;
  overflow: hidden;
  width: 100%;
  span:first-child {
    flex: 1;
    text-align: center;
    background: #141414;
    color: white;
    padding: 4px;
  }
  span:last-child {
    background: #e8bc0e;
    color: black;
    padding: 4px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 19px;
    span:first-child {
      padding: 8px;
    }
    span:last-child {
      padding: 8px;
    }
  }
`

const BananaTvTime = styled.div`
  background: #e8bc0e;
  color: white;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  padding: 2px;
  width: 100%;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    height: 35px;
    padding: 5px;
    font-size: 16px;
  }
`

const BananaImg = styled.img`
  width: 46px;
  height: auto;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    width: 80px;
  }
`

const TitlesBar = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 14px solid #ff1e2c;
  flex: 1 1 auto;
  text-align: left;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    border-left: 18px solid #ff1e2c;
  }
`

const BreakingNews = styled.div`
  background: #ff1e2c;
  color: white;
  font-weight: bold;
  font-size: 14px;
  max-width: 225px;
  padding: 5px 0;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    max-width: 320px;
    font-size: 20px;
    padding: 10px 0;
  }
`

const BigTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  color: black;
  text-transform: uppercase;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  gap: 5px;
  @media screen and (min-width: ${BREAKPOINTS.xs}px) {
    gap: 15px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xl}px) {
    gap: 35px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 42px;
    padding: 12px 14px;
  }
`

const SmallTitle = styled.div`
  background: black;
  color: white;
  padding: 2px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  .first {
    flex-shrink: 0;
  }
  .last {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 85px;
    display: inline-block;
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    .last {
      width: auto;
    }
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    padding: 2px 14px;
    height: 35px;
    font-size: 18px;
  }
`

const BlackStrip = styled.div`
  color: white;
  background: black;
  font-size: 14px;
  text-transform: uppercase;
  padding: 0 14px;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 18px;
  }
`

const tickerh = keyframes`
0% { transform: translate3d(100%, 0, 0); }
100% { transform: translate3d(-400%, 0, 0); }
`

const BlackMovement = styled.div`
  display: flex;
  animation: ${tickerh} linear 35s infinite;
`

const BlackText = styled.div`
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  padding: 5px;

  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    padding: 10px;
  }
`
const CopyText = styled.div`
  font-size: 9px;
  text-align: center;
  color: white;
  margin: 5px 0;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 12px;
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

const ShareButton = styled.a`
  display: flex;
  align-items: center;
  background: #0637a5;
  border: none;
  border-radius: 10px;
  color: white;
  gap: 12px;
  font-size: 12px;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: bold;
  padding: 10px 10px;
  cursor: pointer;
  &:hover {
    background: #0d4ad3;
  }
  span {
    display: none;
  }
  @media screen and (min-width: ${BREAKPOINTS.xl}px) {
    padding: 10px 15px;
    span {
      display: inline-block;
    }
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    font-size: 17px;
    gap: 17px;
    border-radius: 10px;
    padding: 15px 30px;
  }
`

const TitleWithEmoji = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const NewsBarComponent = () => {
  const [date, setDate] = useState(new Date())

  function refreshClock() {
    setDate(new Date())
  }

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000)
    return function cleanup() {
      clearInterval(timerId)
    }
  }, [])

  const [copyText, setCopyText] = useState('0xa47bDB758c729be848170094adb88118deFc6468')
  const [isCopied, staticCopy] = useCopyClipboard()

  const twitterText = 'Apes together strong 🤑🦍🦍🦍'

  return (
    <NewsBar>
      <NewsGroup>
        <TitlesBar>
          <BreakingNews>Breaking News</BreakingNews>
          <BigTitle>
            <TitleWithEmoji>
              The rise of kong
              <IconWrapper size={32}>
                <img src={EmojiDollarFace} alt="emoji dollar face" />
              </IconWrapper>
              <IconWrapper size={32}>
                <img src={EmojiKong} alt="emoji kong" />
              </IconWrapper>
              <IconWrapper size={32}>
                <img src={EmojiKong} alt="emoji kong" />
              </IconWrapper>
              <IconWrapper size={32}>
                <img src={EmojiKong} alt="emoji kong" />
              </IconWrapper>
            </TitleWithEmoji>
            <ShareButton target="_blank" href="https://github.com/long-kong">
              <span>IYKYK</span>
              <GithubIcon size={26} fill="#ffffff" />
            </ShareButton>
          </BigTitle>
          <SmallTitle>
            <span className="first">LONG KONG Token Contract:</span>&nbsp;
            <span className="last">0xa47bDB758c729be848170094adb88118deFc6468</span>
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
          </SmallTitle>
        </TitlesBar>
        <BananaTv>
          <BananaTvTitle>
            <span>BANANA</span>
            <span>TV</span>
          </BananaTvTitle>
          <BananaImg src={Banana} />
          <BananaTvTime>
            {date.toLocaleTimeString(['en-US'], { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' })}{' '}
            EST
          </BananaTvTime>
        </BananaTv>
      </NewsGroup>
      <RSSFeed />
      <CopyText>
        $KONG is a meme coin with no intrinsic value or expectation of financial return. There is no formal team or roadmap. the coin is completely useless and for entertainment purposes only
      </CopyText>
    </NewsBar>
  )
}
