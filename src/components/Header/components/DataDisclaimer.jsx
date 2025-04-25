import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Modal, RightFooter, ButtonSecondary } from '../../generic'
import styled from 'styled-components'
import { dataDisclaimer } from '../../../constants/language'
import theme from '../../../styles/theme'

const ContentText = styled.p`
  color: ${theme.color.black};
  max-width: 800px;
`

const DataDisclaimer = ({ showDisclaimer, handleCloseDisclaimer }) => {
  const _closeDisclaimerWithEscKey = useEffect(() => {
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

  const mainContent = <ContentText>{dataDisclaimer.content}</ContentText>

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleCloseDisclaimer}>Close</ButtonSecondary>
    </RightFooter>
  )
  return (
    <Modal
      isOpen={showDisclaimer}
      onDismiss={handleCloseDisclaimer}
      title={dataDisclaimer.title}
      mainContent={mainContent}
      footerContent={footerContent}
    />
  )
}

DataDisclaimer.propTypes = {
  showDisclaimer: PropTypes.bool.isRequired,
  handleCloseDisclaimer: PropTypes.func.isRequired,
}

export default DataDisclaimer
