import { useEffect } from 'react'
import styled from 'styled-components'
import { Modal, RightFooter, ButtonSecondary } from '../../generic'
import theme from '../../../styles/theme'
import { downloadModal } from '../../../constants/language'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
  color: ${theme.color.black};
`
const DownloadModal = ({ modalOpen, handleClose, activeProjectCount }) => {
  const _closeDisclaimerWithEscKey = useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose])

  const title = activeProjectCount === 0 ? downloadModal.noDataTitle : downloadModal.title

  const content = (
    <ModalBody>
      {activeProjectCount === 0 ? <p>{downloadModal.noDataContent}</p> : <p>Coming soon!</p>}
    </ModalBody>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleClose}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      title={title}
      mainContent={content}
      isOpen={modalOpen}
      onDismiss={handleClose}
      footerContent={footerContent}
    />
  )
}

export default DownloadModal
