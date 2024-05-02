import { AlertTriangle, Slash } from 'react-feather'
import styled, { useTheme } from 'styled-components'

import { MouseoverTooltip } from '../../components/Tooltip'

const BadgeWrapper = styled.div<{ align: 'center' | 'flex-end' | 'flex-start' }>`
  font-size: 14px;
  display: flex;
  justify-content: ${({ align }) => align};
`

const BadgeText = styled.div`
  font-weight: 535;
  font-size: 12px;
  line-height: 14px;
  margin-right: 8px;
`

const ActiveDot = styled.span`
  background-color: ${({ theme }) => theme.success};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`

const LabelText = styled.div<{ color: string }>`
  align-items: center;
  color: ${({ color }) => color};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export default function InfoBadge({
  type,
  title,
  message,
  align = 'flex-end',
}: {
  type?: 'warning' | 'info' | 'success'
  title: string
  message: string
  align?: 'center' | 'flex-end' | 'flex-start'
}) {
  const theme = useTheme()
  return (
    <BadgeWrapper align={align}>
      {type === 'warning' ? (
        <MouseoverTooltip text={message}>
          <LabelText color={theme.deprecated_accentWarning}>
            <BadgeText>{title}</BadgeText>
            <AlertTriangle width={12} height={12} />
          </LabelText>
        </MouseoverTooltip>
      ) : type === 'success' ? (
        <MouseoverTooltip text={message}>
          <LabelText color={theme.success}>
            <BadgeText>{title}</BadgeText>
            <ActiveDot />
          </LabelText>
        </MouseoverTooltip>
      ) : (
        <MouseoverTooltip text={message}>
          <LabelText color={theme.neutral2}>
            <BadgeText>{title}</BadgeText>
            <Slash width={12} height={12} />
          </LabelText>
        </MouseoverTooltip>
      )}
    </BadgeWrapper>
  )
}
