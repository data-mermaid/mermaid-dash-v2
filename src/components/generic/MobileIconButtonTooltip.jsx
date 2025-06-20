import { useState } from 'react'
import PropTypes from 'prop-types'

import { ClickAwayListener, Tooltip } from '@mui/material'
import { IconButton } from './buttons'
import { IconInfo } from '../../assets/icons'
import theme from '../../styles/theme'

const MobileIconButtonTooltip = ({ title, ariaLabel, placement = 'top' }) => {
  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={title}
        placement={placement}
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        arrow
        slotProps={{
          popper: {
            disablePortal: false,
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
              backgroundColor: `${theme.color.primaryColor}`,
            },
          },
          arrow: {
            sx: {
              color: `${theme.color.primaryColor}`,
            },
          },
        }}
      >
        <IconButton
          type="button"
          aria-label={ariaLabel}
          style={{
            display: 'flex',
          }}
          onClick={handleTooltipOpen}
        >
          <IconInfo />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  )
}

export default MobileIconButtonTooltip

MobileIconButtonTooltip.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  ariaLabel: PropTypes.string.isRequired,
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
}
