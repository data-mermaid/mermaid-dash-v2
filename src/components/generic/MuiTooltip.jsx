import PropTypes from 'prop-types'
import { styled, Tooltip } from '@mui/material'
import theme from '../../styles/theme'

const StyledTooltip = styled(
  ({ className, ...props }) => <Tooltip {...props} classes={{ tooltip: className }} />,
  {
    shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'tooltipTextColor', // Prevent these props from being passed to the DOM
  },
)(({ bgColor, tooltipTextColor }) => ({
  backgroundColor: `${bgColor}`,
  color: `${tooltipTextColor}`,
  fontSize: `${theme.typography.smallFontSize}`,
  [`& .MuiTooltip-arrow`]: {
    color: `${bgColor}`,
  },
}))

export const MuiTooltip = ({
  children,
  title,
  placement = 'bottom',
  bgColor = theme.color.white,
  tooltipTextColor = theme.color.black,
}) => {
  return (
    <StyledTooltip
      title={title}
      placement={placement}
      bgColor={bgColor}
      tooltipTextColor={tooltipTextColor}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
      arrow
    >
      {children}
    </StyledTooltip>
  )
}

MuiTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  placement: PropTypes.string,
  bgColor: PropTypes.object,
  tooltipTextColor: PropTypes.object,
}
