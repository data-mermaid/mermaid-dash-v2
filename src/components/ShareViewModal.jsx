import { useState } from 'react'
import { shareView } from '../constants/language'

import { color } from '../constants/theme'
import theme from '../theme'
import styled from 'styled-components'
import { ShareViewButton } from './Header/Header.styles'
import Modal, { RightFooter } from './generic/Modal'
import { ButtonPrimary, ButtonSecondary } from './generic/buttons'
import { Input } from './generic/form'
import { IconCopy } from './icons'

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

const ModalDescription = styled.div`
  color: ${color.mermaidBlack};
`

const ModalURLContainer = styled.div`
  flex-grow: 1;
`

export default function ShareViewModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const modalTitle = shareView.modalHeader
  const modalContent = (
    <ModalBody>
      <ModalCopyContainer>
        <ModalURLContainer>
          <Input value={window.location.href} readonly></Input>
        </ModalURLContainer>
        <ButtonPrimary onClick={handleCopyURL}>
          <IconCopy /> Copy
        </ButtonPrimary>
      </ModalCopyContainer>
      <ModalDescription>{shareView.modalBody}</ModalDescription>
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
