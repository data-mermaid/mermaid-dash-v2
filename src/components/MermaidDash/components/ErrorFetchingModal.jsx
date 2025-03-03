import PropTypes from 'prop-types'
import { Modal, RightFooter, ButtonPrimary } from '../../generic'
import styled from 'styled-components'
import { errorModal } from '../../../constants/language'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
`

const ErrorFetchingModal = ({ isOpen, onDismiss }) => {
  const content = (
    <ModalBody>
      <p>
        {errorModal.content} <a href="mailto:support@datamermaid.org">support@datamermaid.org</a>
      </p>
    </ModalBody>
  )

  const footerContent = (
    <RightFooter>
      <ButtonPrimary onClick={() => window.location.reload()}>Reload</ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={errorModal.title}
      mainContent={content}
      footerContent={footerContent}
    />
  )
}

ErrorFetchingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ErrorFetchingModal
