import { useContext } from 'react'
import PropTypes from 'prop-types'
import theme from '../../../styles/theme'
import styled from 'styled-components'
import { successExportModal } from '../../../constants/language'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { Modal, RightFooter, ButtonSecondary } from '../../generic'

const CitationContainer = styled.div`
  background-color: ${theme.color.grey1};
  padding: 0.1rem 2rem;
`

const SuccessExportModal = ({ isOpen, onDismiss }) => {
  const { mermaidUserData } = useContext(FilterProjectsContext)

  const modalContent = (
    <>
      <p>{successExportModal.content(mermaidUserData.email)} </p>
      <CitationContainer>
        <h4>{successExportModal.citationHeader}</h4>
        <p>{successExportModal.citationContent} </p>
      </CitationContainer>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{successExportModal.footerButton}</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={successExportModal.title}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

SuccessExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default SuccessExportModal
