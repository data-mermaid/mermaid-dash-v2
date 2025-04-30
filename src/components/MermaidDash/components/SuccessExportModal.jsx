import { useContext } from 'react'
import PropTypes from 'prop-types'
import theme from '../../../styles/theme'
import styled from 'styled-components'
import { successExportModal } from '../../../constants/language'
import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import { Modal, RightFooter, ButtonSecondary } from '../../generic'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

const CitationContainer = styled.div`
  background-color: ${theme.color.grey1};
  padding: 0.1rem 2rem;
  margin-bottom: 1rem;
`

const SuccessExportModal = ({
  isOpen,
  onDismiss,
  selectedExportDataSharingPolicy = null,
  selectedExportSurveyCount = 0,
  projectId = null,
}) => {
  const { mermaidUserData } = useContext(FilterProjectsContext)
  const contactAdminsLink = (
    <a
      href={`https://datamermaid.org/contact-project?project_id=${projectId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Contact admins
    </a>
  )

  const sampleEventContactAdminOrSurveyCount =
    selectedExportDataSharingPolicy === 'private'
      ? `(This method is set to private.`
      : `(${pluralizeWordWithCount(selectedExportSurveyCount, 'survey')})`

  const observationLevelContactAdminOrSurveyCount =
    selectedExportDataSharingPolicy !== 'public'
      ? `(This method is set to ${selectedExportDataSharingPolicy}.`
      : `(${pluralizeWordWithCount(selectedExportSurveyCount, 'survey')})`

  const modalContent = (
    <>
      <p>{successExportModal.content(mermaidUserData.email)} </p>
      {projectId !== null && (
        <CitationContainer>
          <h4>{successExportModal.exportDataInfoHeader}</h4>
          <ul>
            <li>{successExportModal.metadataExport}</li>
            <li>
              {successExportModal.sampleEventLevelExport(selectedExportDataSharingPolicy)}{' '}
              {sampleEventContactAdminOrSurveyCount}
              {selectedExportDataSharingPolicy === 'private' && <>{contactAdminsLink})</>}
            </li>
            <li>
              {successExportModal.observationLevelExport(selectedExportDataSharingPolicy)}{' '}
              {observationLevelContactAdminOrSurveyCount}{' '}
              {selectedExportDataSharingPolicy !== 'public' && <>{contactAdminsLink})</>}
            </li>
          </ul>
        </CitationContainer>
      )}
      <CitationContainer>
        <h4>{successExportModal.citationHeader}</h4>
        <p>{successExportModal.citationContent}</p>
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
  selectedExportDataSharingPolicy: PropTypes.string,
  selectedExportSurveyCount: PropTypes.number,
  projectId: PropTypes.string,
}

export default SuccessExportModal
