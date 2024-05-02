import styled, { keyframes } from 'styled-components'

/* notification */
const slide = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`

const NotificationContainer = styled.div`
  position: relative;
  width: 250px;
  font-size: 14px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-left: 5px solid ${({ theme }) => theme.success};
  padding: 1rem;
  background-color: ${({ theme }) => theme.surface1};
  transition: transform 200ms ease-in-out;
  animation: ${slide} 1000ms 1;
  p {
    margin: 0;
  }
  a {
    color: white;
  }
`

export const NotificationWrapper = styled.div`
  position: fixed;
  right: 2rem;
`

export const Notification = (props: { message: string; handleClick: () => void }) => {
  return (
    <NotificationContainer
      onClick={props.handleClick}
      dangerouslySetInnerHTML={{ __html: props.message }}
    ></NotificationContainer>
  )
}
