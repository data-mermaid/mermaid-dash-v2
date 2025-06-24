import { useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, ClickAwayListener } from '@mui/material'
import theme from '../../styles/theme'

export const MuiTooltip = ({
  children,
  title,
  placement = 'bottom',
  bgColor = theme.color.white,
  tooltipTextColor = theme.color.black,
  isMobileWidth = false,
}) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const commonProps = {
    title,
    placement,
    arrow: true,
    slotProps: {
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
      tooltip: {
        sx: {
          backgroundColor: `${bgColor}`,
          color: `${tooltipTextColor}`,
          fontSize: `${theme.typography.smallFontSize}`,
        },
      },
      arrow: {
        sx: {
          color: `${bgColor}`,
        },
      },
    },
  }

  return isMobileWidth ? (
    <ClickAwayListener onClickAway={handleClose}>
      <div onClick={handleClick}>
        <Tooltip
          {...commonProps}
          open={open}
          disableHoverListener
          disableFocusListener
          disableTouchListener
        >
          {children}
        </Tooltip>
      </div>
    </ClickAwayListener>
  ) : (
    <Tooltip {...commonProps}>{children}</Tooltip>
  )
}

MuiTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  placement: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  bgColor: PropTypes.string,
  tooltipTextColor: PropTypes.string,
  isMobileWidth: PropTypes.bool,
}
