import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Button, Typography, Modal, TextField } from '@mui/material'
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material'
import { shareView } from '../constants/language'

import { color } from '../constants/theme'
import theme from '../theme'
import styled from 'styled-components'

const sxStyles = {
  modalURLTextFieldInputProps: {
    borderRadius: 0,
  },
}

const useStyles = makeStyles({
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

  modalHeader: {
    fontWeight: '60rem',
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
  modalCloseButton: {
    borderWidth: theme.spacing.borderSmall,
    borderColor: color.mermaidBlack,
    color: color.mermaidBlack,
    textTransform: 'none',
    fontSize: theme.typography.smallFontSize,
    borderRadius: 0,
  },
})

const ModalBody = styled.div`
  background-color: ${color.mermaidWhiteGray};
  padding-left: 2rem;
  padding-right: 2rem;
`

const ModalFooter = styled.div`
  background-color: ${color.mermaidWhite};
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
`

const ModalCopyContainer = styled.div`
  flex-direction: row;
  display: flex;
  align-items: stretch;
  height: 100%;
  margin-top: ${theme.spacing.xlarge};
  margin-bottom: ${theme.spacing.xlarge};
`

export default function ShareViewModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const classes = useStyles()
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div>
      <Button disableRipple onClick={handleOpenModal} className={classes.menuShareViewBtn}>
        {shareView.headerButton}
      </Button>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{}} className={classes.modalContainer}>
          <ModalBody>
            <Typography variant="h3" className={classes.modalHeader}>
              {shareView.modalHeader}
            </Typography>
            <ModalCopyContainer>
              <TextField
                value={window.location.href}
                className={classes.modalURLTextField}
                InputProps={{ sx: sxStyles.modalURLTextFieldInputProps }}
              />
              <Button
                onClick={handleCopyURL}
                variant="contained"
                className={classes.modalCopyButton}
              >
                <ContentCopyIcon className={classes.modalCopyIcon} />
                Copy
              </Button>
            </ModalCopyContainer>
            <Typography className={classes.modalDescription}>{shareView.modalBody}</Typography>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              className={classes.modalCloseButton}
            >
              Close
            </Button>
          </ModalFooter>
        </Box>
      </Modal>
    </div>
  )
}
