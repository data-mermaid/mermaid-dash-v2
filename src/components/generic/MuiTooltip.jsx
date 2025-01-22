import React from 'react'
import { styled, Tooltip } from '@mui/material'
import theme from '../../styles/theme'

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
))(() => ({
  backgroundColor: `${theme.color.primaryColor}`, // Tooltip background color
  color: 'white', // Tooltip text color
  fontSize: '14px', // Tooltip font size
  [`& .MuiTooltip-arrow`]: {
    color: `${theme.color.primaryColor}`, // Arrow inherits the tooltip's background color
  },
}))
export const MuiTooltip = ({ children, title, placement = 'bottom' }) => {
  return (
    <StyledTooltip
      title={title}
      placement={placement}
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
