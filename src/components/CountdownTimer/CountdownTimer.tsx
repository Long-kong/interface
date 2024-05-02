import { BigNumber } from '@ethersproject/bignumber'
import { useGetBlockNumber } from 'hooks/useGetBlockNumber'
import { useGetBootstrapTimestampEnd } from 'hooks/useGetBootstrapTimestampEnd'
import { useGetCycle } from 'hooks/useGetCycle'
import { useGetCycleInSeconds } from 'hooks/useGetCycleInSeconds'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { BREAKPOINTS } from 'theme'

const Countdown = styled.div`
  border: 3px solid #004fff;
  border-radius: 3px;
  background: #131f3a;
  opacity: 0.8;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    border-width: 5px;
    border-radius: 10px;
    padding: 20px 0;
  }
`

const Time = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  text-transform: uppercase;
  span {
    font-weight: bold;
    &:first-child {
      font-size: 22px;
    }
    &:last-child {
      font-size: 10px;
    }
  }
  &:after {
    content: '';
    position: relative;
    width: 100%;
    height: 4px;
    background: #004fff;
    margin-top: 4px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xxl}px) {
    &:after {
      height: 6px;
      margin-top: 6px;
    }
    span {
      &:first-child {
        font-size: 44px;
      }
      &:last-child {
        font-size: 14px;
      }
    }
  }
`

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export const Timer = ({
  deadline = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime(),
  setTimerFinished,
}: {
  deadline?: number
  setTimerFinished: () => void
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
    }, SECOND)

    return () => clearInterval(intervalRef.current)
  }, [parsedDeadline, time])

  useEffect(() => {
    if (Math.trunc(time / SECOND) <= 1) {
      timer()
      setTimerFinished()
    }
  }, [timer, time, setTimerFinished])

  return (
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
  )
}
