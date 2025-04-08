import PropTypes from 'prop-types'
import { Modal, RightFooter, ButtonPrimary } from '../../generic'
import { errorModal } from '../../../constants/language'

const ErrorFetchingModal = ({ isOpen, onDismiss }) => {
  const mainContent = (
    <p>
      {errorModal.content} <a href="mailto:support@datamermaid.org">support@datamermaid.org</a>
    </p>
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
      mainContent={mainContent}
      footerContent={footerContent}
      hideCloseIcon={true}
    />
  )
}

ErrorFetchingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ErrorFetchingModal
