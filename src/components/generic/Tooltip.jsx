import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../styles/theme'

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`

const TooltipText = styled.span`
  display: none;
  width: ${({ $tooltipTextWith }) => $tooltipTextWith || '14ch'};
  font-size: ${theme.typography.smallFontSize};
  background-color: white;
  color: black;
  text-align: center;
  border-radius: 4px;
  border-width: ${theme.spacing.borderSmall};
  border-color: ${theme.color.grey0};
  border-style: solid;
  padding: 5px;
  position: absolute;
  z-index: 100;
  top: 125%;
  left: ${({ $leftPlacement, $rightPlacement }) =>
    $leftPlacement ? '40px' : $rightPlacement ? '-25px' : '50%'};
  transform: translateX(-50%);
  transition: ${theme.timing.TooltipTransition};
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: ${({ $leftPlacement, $rightPlacement }) =>
      $leftPlacement ? '10%' : $rightPlacement ? '90%' : '50%'};
    margin-left: -7px;
    border-width: 7px;
    border-style: solid;
    border-color: transparent transparent black transparent;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: calc(100% - 1px);
    left: ${({ $leftPlacement, $rightPlacement }) =>
      $leftPlacement ? '10%' : $rightPlacement ? '90%' : '50%'};
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent white transparent;
  }
`

const TooltipWrapper = styled(TooltipContainer)`
  margin-left: ${({ tooltipMarginLeft }) => tooltipMarginLeft || '0'};

  &:hover ${TooltipText} {
    display: block;
  }
`

export const Tooltip = ({ children, text, styleProps = undefined }) => {
  return (
    <TooltipWrapper $tooltipMarginLeft={styleProps?.tooltipMarginLeft}>
      {children}
      <TooltipText
        $tooltipTextWith={styleProps?.tooltipTextWith}
        $leftPlacement={styleProps?.leftPlacement}
        $rightPlacement={styleProps?.rightPlacement}
      >
        {text}
      </TooltipText>
    </TooltipWrapper>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  styleProps: PropTypes.object,
}
