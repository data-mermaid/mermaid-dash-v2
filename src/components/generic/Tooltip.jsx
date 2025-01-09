import styled from 'styled-components'
import theme from '../../styles/theme'

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`

const TooltipText = styled.span`
  visibility: hidden;
  min-width: 100px;
  width: 100%;
  font-size: ${theme.typography.smallFontSize};
  background-color: white; /* White background */
  color: black; /* Black text */
  text-align: center;
  border-radius: 4px;
  border-width: ${theme.spacing.borderSmall};
  border-color: ${theme.color.grey0};
  border-style: solid;
  padding: 5px;
  position: absolute;
  z-index: 100;
  top: 125%; /* Position below the tooltip container */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: ${theme.timing.TooltipTransition};
  &::before {
    content: '';
    position: absolute;
    bottom: 100%; /* Position the black border below the tooltip */
    left: 50%;
    margin-left: -7px; /* Center the arrow */
    border-width: 7px;
    border-style: solid;
    border-color: transparent transparent black transparent; /* Black border */
  }
  &::after {
    content: '';
    position: absolute;
    bottom: calc(100% - 1px); /* Slightly move to overlap black border */
    left: 50%;
    margin-left: -6px; /* Center the white arrow */
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent white transparent; /* White arrow */
  }
`

const TooltipWrapper = styled(TooltipContainer)`
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1; /* Show tooltip on hover */
  }
`

export const Tooltip = ({ children, text }) => (
  <TooltipContainer>
    <TooltipWrapper>
      {children}
      <TooltipText>{text}</TooltipText>
    </TooltipWrapper>
  </TooltipContainer>
)
