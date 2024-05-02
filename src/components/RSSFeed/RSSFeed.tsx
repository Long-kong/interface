import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { BREAKPOINTS } from 'theme'

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
100% { transform: translate3d(-100%, 0, 0); }
`

const BlackMovement = styled.div`
  display: flex;
  align-items: center;
  animation: ${tickerh} linear 35s infinite;
`

const BlackText = styled.a`
  color: white;
  flex-shrink: 0;
  box-sizing: border-box;
  text-align: center;
  padding: 5px;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    padding: 10px;
  }
`

const RSSFeed = () => {
  const [feedItems, setFeedItems] = useState<any[]>([])

  useEffect(() => {
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
    const rssUrl = CORS_PROXY + 'https://cointelegraph.com/rss'
    // const rssUrl = 'https://cointelegraph.com/rss'

    fetch(rssUrl)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((data) => {
        const items = data.querySelectorAll('item')
        const parsedItems: any[] = []
        items.forEach((item: any) => {
          parsedItems.push({
            title: item.querySelector('title').textContent,
            link: item.querySelector('link').textContent,
            contentSnippet: item.querySelector('description').textContent,
          })
        })
        setFeedItems(parsedItems)
      })
      .catch((error) => {
        console.error('Error fetching or parsing RSS feed:', error)
      })
  }, [])

  const [values, setValues] = useState(['News bar 1', 'News bar 2', 'News bar 3', 'News bar 4'])

  return (
    <BlackStrip>
      <BlackMovement>
        {feedItems.map((item: any, index: number) => (
          <>
            <BlackText key={index + feedItems.length} href={item.link} target="_blank" rel="noopener noreferrer">
              {item.title}
            </BlackText>
            &#9830;
          </>
        ))}
      </BlackMovement>
    </BlackStrip>
  )
}

export default RSSFeed
