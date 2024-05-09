import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Button, Typography, Modal, TextField } from '@mui/material'
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material'

import { color } from '../constants/theme'
import theme from '../theme'

const sxStyles = {
  modalURLTextFieldInputProps: {
    borderRadius: 0,
  },
}

const styles = makeStyles({
  menuShareViewBtn: {
    margin: '0.8rem',
    backgroundColor: color.mermaidCallout,
    color: color.mermaidWhite,
    borderRadius: '1.5rem',
    padding: theme.spacing.buttonPadding,
    textTransform: 'none',
    width: '16rem',
    fontSize: theme.typography.defaultFontSize,
    '&:hover': {
      backgroundColor: color.mermaidCallout,
      color: color.mermaidWhite,
    },
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    border: '2px solid #000',
    boxShadow: 24,
  },
  modalBody: {
    backgroundColor: color.mermaidWhiteGray,
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  modalHeader: {
    fontWeight: '60rem',
    marginTop: theme.spacing.xlarge,
    marginBottom: theme.spacing.xlarge,
  },
  modalCopyContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'stretch',
    height: '100%',
    marginTop: theme.spacing.xlarge,
    marginBottom: theme.spacing.xlarge,
  },
  modalURLTextField: {
    flexGrow: 1,
    '& .MuiInputBase-input': {
      padding: 0,
      paddingLeft: theme.spacing.medium,
      paddingRight: theme.spacing.right,
      fontSize: theme.typography.largeFontSize,
    },
  },

  modalCopyButton: {
    backgroundColor: color.mermaidDarkBlue,
    fontSize: theme.typography.smallFontSize,
    borderRadius: 0,
  },
  modalCopyIcon: {
    marginRight: theme.spacing.xsmall,
  },
  modalDescription: {
    fontSize: theme.typography.defaultFontSize,
    marginTop: theme.spacing.xlarge,
    marginBottom: theme.spacing.xlarge,
  },
  modalFooter: {
    backgroundColor: color.mermaidWhite,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalCloseButton: {
    borderWidth: theme.spacing.borderSmall,
    borderColor: color.mermaidBlack,
    color: color.mermaidBlack,
    textTransform: 'none',
    fontSize: theme.typography.smallFontSize,
    borderRadius: 0,
  },
})

export default function ShareViewModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const classes = styles()
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div>
      <Button onClick={handleOpenModal} className={classes.menuShareViewBtn}>
        Share this view
      </Button>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{}} className={classes.modalContainer}>
          <div className={classes.modalBody}>
            <Typography variant="h3" className={classes.modalHeader}>
              Share this view of the dashboard
            </Typography>
            <div className={classes.modalCopyContainer}>
              <TextField
                value={window.location.href}
                className={classes.modalURLTextField}
                InputProps={{ sx: sxStyles.modalURLTextFieldInputProps }}
              ></TextField>
              <Button
                onClick={handleCopyURL}
                variant="contained"
                className={classes.modalCopyButton}
              >
                <ContentCopyIcon className={classes.modalCopyIcon} />
                Copy
              </Button>
            </div>
            <Typography className={classes.modalDescription}>
              Click copy to copy the current URL to your clipboard. If you are sharing sensitive
              data, please make sure the person you are sharing with also has access to the
              sensitive data.
            </Typography>
          </div>
          <div className={classes.modalFooter}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              className={classes.modalCloseButton}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
