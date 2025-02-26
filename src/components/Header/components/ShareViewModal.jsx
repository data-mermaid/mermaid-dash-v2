import { useState, useCallback } from 'react'
import { shareView } from '../../../constants/language'
import theme from '../../../styles/theme'
import styled from 'styled-components'
import { ShareViewButton } from '../Header.styles'
import { Modal, RightFooter, ButtonPrimary, ButtonSecondary, Input } from '../../generic'
import { IconCopy } from '../../../assets/icons'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
`

const ModalCopyContainer = styled.div`
  flex-direction: row;
  display: flex;
  align-items: stretch;
  height: 100%;
  margin-top: ${theme.spacing.xlarge};
  margin-bottom: ${theme.spacing.xlarge};
`

const ModalURLContainer = styled.div`
  flex-grow: 1;
`

const StyledCopyButton = styled(ButtonPrimary)`
  width: 100px;
`

const ShareViewModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [buttonText, setButtonText] = useState('Copy')
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen])

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
    setButtonText('Copied')
    setTimeout(() => setButtonText('Copy'), 2000)
  }

  const modalTitle = shareView.modalHeader
  const modalContent = (
    <ModalBody>
      <ModalCopyContainer>
        <ModalURLContainer>
          <Input value={window.location.href} readOnly></Input>
        </ModalURLContainer>
        <StyledCopyButton onClick={handleCopyURL}>
          <IconCopy /> {buttonText}
        </StyledCopyButton>
      </ModalCopyContainer>
    </ModalBody>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleCloseModal}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <div>
      <ShareViewButton onClick={handleOpenModal}>Share this view</ShareViewButton>
      <Modal
        isOpen={isModalOpen}
        onDismiss={handleCloseModal}
        title={modalTitle}
        mainContent={modalContent}
        footerContent={footerContent}
      />
    </div>
  )
}

export default ShareViewModal
