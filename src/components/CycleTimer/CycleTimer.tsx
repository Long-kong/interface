import { BigNumber } from '@ethersproject/bignumber'
import { useGetBlockNumber } from 'hooks/useGetBlockNumber'
import { useGetBootstrapTimestampEnd } from 'hooks/useGetBootstrapTimestampEnd'
import { useGetCycle } from 'hooks/useGetCycle'
import { useGetCycleInSeconds } from 'hooks/useGetCycleInSeconds'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { BREAKPOINTS } from 'theme'

const Countdown = styled.div`
  width: 100%;
  border-radius: 14px;
  background: rgba(19, 31, 58, 0.9);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    padding: 20px 0;
  }
`

const CountdownContainer = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const Time = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  text-transform: uppercase;
  font-weight: 400;
  span {
    font-weight: bold;
    &:first-child {
      font-size: 24px;
      line-height: 20px;
    }
    &:last-child {
      font-size: 10px;
      line-height: 20px;
    }
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    span {
      &:first-child {
        font-size: 35px;
      }
      &:last-child {
        font-size: 14px;
      }
    }
  }
`

const Dots = styled.span`
  font-size: 35px;
`

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export const CycleTimer = ({
  deadline = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime(),
}: {
  deadline?: number
}) => {
  const getCycle = useGetCycle()
  const getCycleInSeconds = useGetCycleInSeconds()
  const getBlockTimestamp = useGetBlockNumber()
  const getBootstrapTimestamp = useGetBootstrapTimestampEnd()

  const [currentCycle, setCurrentCycle] = useState<BigNumber>()
  const [cycleInSeconds, setCycleInSeconds] = useState<BigNumber>()
  const [blockTimestamp, setBlockTimestamp] = useState(0)
  const [nextCycleTimestamp, setNextCycleTimestamp] = useState(0)

  const parsedDeadline = useMemo(
    () => (nextCycleTimestamp - blockTimestamp) * 1000 + Date.now(),
    [nextCycleTimestamp, blockTimestamp]
  )
  const [time, setTime] = useState(parsedDeadline - Date.now())

  const timer = useCallback(() => {
    Promise.allSettled([getCycle(), getCycleInSeconds(), getBootstrapTimestamp(), getBlockTimestamp()]).then(
      ([comingCycle, inSeconds, bootstrap, block]: any) => {
        if (comingCycle.value && inSeconds.value && bootstrap.value && block.value) {
          const nextCycle = inSeconds.value?.mul(comingCycle.value)?.add(bootstrap.value)?.toNumber()
          setBlockTimestamp(block.value.timestamp)
          setNextCycleTimestamp(nextCycle)
        }
      }
    )
  }, [getBlockTimestamp, getBootstrapTimestamp, getCycle, getCycleInSeconds])

  const intervalRef = useRef<any>()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime(parsedDeadline - Date.now())
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [parsedDeadline, time])

  useEffect(() => {
    if (Math.trunc(time / 1000) <= 1) {
      timer()
    }
  }, [timer, time])

  return (
    <Countdown>
      <CountdownContainer>
        {Object.entries({
          Days: time / DAY,
          Hours: (time / HOUR) % 24,
          Minutes: (time / MINUTE) % 60,
          Seconds: (time / SECOND) % 60,
        }).map(([label, value], index) => (
          <>
            <Time key={label}>
              <span>{`${time > 0 ? Math.floor(value) : 0}`.padStart(2, '0')}</span>
              <span>{label}</span>
            </Time>
            {index !== 3 && <Dots>:</Dots>}
          </>
        ))}
      </CountdownContainer>
    </Countdown>
  )
}
