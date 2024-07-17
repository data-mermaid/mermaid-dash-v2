import PropTypes from 'prop-types'
import { useEffect } from 'react'
import Modal from './generic/Modal'
import styled from 'styled-components'
import { dataDisclaimer } from '../constants/language'
import { RightFooter } from './generic/Modal'
import { ButtonSecondary } from './generic/buttons'
import theme from '../theme'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
  color: ${theme.color.black};
`

export default function DataDisclaimer(props) {
  const { showDisclaimer, handleCloseDisclaimer } = props

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCloseDisclaimer()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleCloseDisclaimer])

  const content = (
    <ModalBody>
      <p>{dataDisclaimer.content}</p>
    </ModalBody>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleCloseDisclaimer}>Close</ButtonSecondary>
    </RightFooter>
  )
  return (
    <Modal
      title={dataDisclaimer.title}
      mainContent={content}
      isOpen={showDisclaimer}
      onDismiss={handleCloseDisclaimer}
      footerContent={footerContent}
    />
  )
}

DataDisclaimer.propTypes = {
  showDisclaimer: PropTypes.bool.isRequired,
  handleCloseDisclaimer: PropTypes.func.isRequired,
}
