import { useState, useCallback } from 'react'
import { shareView } from '../../../constants/language'
import theme from '../../../styles/theme'
import styled from 'styled-components'
import { ShareViewButton } from '../Header.styles'
import { Modal, RightFooter, ButtonPrimary, ButtonSecondary, Input } from '../../generic'
import { IconCopy, IconSharing } from '../../../assets/icons'
import useResponsive from '../../../hooks/useResponsive'

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
  const { isMobileWidth } = useResponsive()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [buttonText, setButtonText] = useState('Copy')
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen])

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href)
    setButtonText('Copied')
    setTimeout(() => setButtonText('Copy'), 2000)
  }

  const mainContent = (
    <ModalCopyContainer>
      <ModalURLContainer>
        <Input value={window.location.href} readOnly></Input>
      </ModalURLContainer>
      <StyledCopyButton onClick={handleCopyURL}>
        <IconCopy /> {buttonText}
      </StyledCopyButton>
    </ModalCopyContainer>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleCloseModal}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <div>
      <ShareViewButton onClick={handleOpenModal}>
        {isMobileWidth ? <IconSharing /> : 'Share this view'}
      </ShareViewButton>
      <Modal
        isOpen={isModalOpen}
        onDismiss={handleCloseModal}
        title={shareView.modalHeader}
        mainContent={mainContent}
        footerContent={footerContent}
      />
    </div>
  )
}

export default ShareViewModal
