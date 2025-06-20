import { useContext, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import theme from '../../../styles/theme'

import { EXPORT_METHODS } from '../../../constants/constants'

import {
  Modal,
  RightFooter,
  ButtonSecondary,
  ButtonPrimary,
  ButtonThatLooksLikeLinkUnderlined,
} from '../../generic'

import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

import ExportTableView from './ExportTableView'
import DataSharingInfoModal from './DataSharingInfoModal'
import { IconInfo } from '../../../assets/icons'
import { LeftFooter } from '../../generic/Modal'
import { formatExportProjectDataHelper } from '../../../helperFunctions/formatExportProjectDataHelper'

const StyledExportContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledWarningText = styled.div`
  height: 36px;
  display: flex;
  flex-direction: column;
  background-color: ${theme.color.white2};
  padding: 0px 10px;
  gap: 5px;
  font-size: ${theme.typography.smallFontSize};
  justify-content: center;
`

const CitationContainer = styled.div`
  background-color: ${theme.color.grey1};
  padding: 0.1rem 2rem;
`

const ExportModal = ({ isOpen, onDismiss, selectedMethod, surveyedMethodCount }) => {
  const { getActiveProjectCount, mermaidUserData, userIsMemberOfProject, displayedProjects } =
    useContext(FilterProjectsContext)
  const { t } = useTranslation()

  const activeProjectCount = getActiveProjectCount()
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [modalMode, setModalMode] = useState(null)
  const [isDataSharingModalOpen, setIsDataSharingModalOpen] = useState(false)
  const [exportTableData, setExportTableData] = useState([])
  const [invalidProjectsCount, setInvalidProjectsCount] = useState(0)
  const exportMethodTitle = EXPORT_METHODS[selectedMethod]?.description

  const _resetModalModeWhenModalOpenOrClose = useEffect(() => {
    if (isOpen) {
      setModalMode(activeProjectCount === 0 ? 'no data' : 'export')
    } else {
      setModalMode(null)
    }
  }, [isOpen, activeProjectCount])

  const _getSiteRecords = useEffect(() => {
    if (!selectedMethod) {
      return
    }

    const formattedTableData = displayedProjects.map((project, index) => {
      const isMemberOfProject = userIsMemberOfProject(project.project_id, mermaidUserData)
      const formattedData = formatExportProjectDataHelper(
        project,
        isMemberOfProject,
        selectedMethod,
      )

      return {
        id: index,
        ...formattedData,
        isMemberOfProject,
        rawProjectData: project,
      }
    })

    const invalidProjects = formattedTableData.filter(({ transectCount }) => transectCount === 0)

    setInvalidProjectsCount(invalidProjects.length)
    setExportTableData(formattedTableData.filter(({ transectCount }) => transectCount > 0))
  }, [displayedProjects, selectedMethod, mermaidUserData, userIsMemberOfProject])

  const titleByMode = (() => {
    const titles = {
      'no data': t('no_gfcr_data_export'),
      success: t('export_request_sent'),
      failure: t('export_request_failed'),
    }

    return titles[modalMode] || t('export_method_data', { method: exportMethodTitle })
  })()

  const handleSendEmailWithLinkSubmit = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : ''

      if (!token) {
        throw new Error('Failed request - No token provided')
      }

      const selectedMethodProtocol = EXPORT_METHODS[selectedMethod]?.protocol
      const projectIds = exportTableData.map(({ projectId }) => projectId)

      const reportEndpoint = `${import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE}/v1/reports/`
      const requestData = {
        report_type: 'summary_sample_unit_method',
        project_ids: projectIds,
        protocol: selectedMethodProtocol,
      }

      const response = await fetch(reportEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`Failed request - ${response.status}`)
      }

      setModalMode('success')
    } catch (error) {
      console.error(error)
      toast.error(t('errors.send_email_failed'))
    }
  }

  const toolbarContent = modalMode === 'export' && (
    <StyledExportContentWrapper>
      <div>
        All exports will contain metadata for all projects.{' '}
        <a
          target="_blank"
          href="https://datamermaid.org/documentation/explore-app"
          rel="noopener noreferrer"
        >
          Learn More.
        </a>
      </div>
      <ButtonThatLooksLikeLinkUnderlined onClick={() => setIsDataSharingModalOpen(true)}>
        Learn more about how your data are shared...
      </ButtonThatLooksLikeLinkUnderlined>
    </StyledExportContentWrapper>
  )

  const exportContent = (
    <>
      <ExportTableView exportTableData={exportTableData} />
      <DataSharingInfoModal
        isOpen={isDataSharingModalOpen}
        onDismiss={() => setIsDataSharingModalOpen(false)}
      />
    </>
  )

  const successContent = (
    <>
      <p>{t('email_confirmation', { email: mermaidUserData.email })} </p>
      <CitationContainer>
        <h4>{t('credit_data_owner')}</h4>
        <p>{t('suggested_citation')} </p>
      </CitationContainer>
    </>
  )

  const MODAL_CONTENT_BY_MODE = {
    'no data': <p>{t('no_projects_data')}</p>,
    export: exportContent,
    success: successContent,
  }

  const mainContent = <>{MODAL_CONTENT_BY_MODE[modalMode] || null}</>

  const footerContent = (
    <>
      {modalMode === 'export' && (
        <LeftFooter>
          <StyledWarningText>
            <div>
              Total exported projects: {exportTableData.length}. {'   '}Total surveys:{' '}
              {surveyedMethodCount[selectedMethod] ?? 0}
            </div>
            {invalidProjectsCount > 0 && (
              <span>
                <IconInfo />{' '}
                {pluralizeWordWithCount(
                  invalidProjectsCount,
                  'other project does',
                  'other projects do',
                )}{' '}
                not have {exportMethodTitle} data.
              </span>
            )}
          </StyledWarningText>
        </LeftFooter>
      )}
      <RightFooter>
        <ButtonSecondary onClick={onDismiss}>
          {modalMode === 'success' ? 'Done' : 'Close'}
        </ButtonSecondary>
        {modalMode === 'export' && (
          <ButtonPrimary onClick={handleSendEmailWithLinkSubmit}>
            Send Email With Link
          </ButtonPrimary>
        )}
      </RightFooter>
    </>
  )

  if (!modalMode) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={titleByMode}
      mainContent={mainContent}
      toolbarContent={toolbarContent}
      footerContent={footerContent}
      contentOverflowIsVisible={true}
    />
  )
}

ExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  selectedMethod: PropTypes.string.isRequired,
  surveyedMethodCount: PropTypes.shape({
    beltfish: PropTypes.number,
    benthiclit: PropTypes.number,
    benthicpit: PropTypes.number,
    benthicpqt: PropTypes.number,
    colonies_bleached: PropTypes.number,
    habitatcomplexity: PropTypes.number,
    quadrat_benthic_percent: PropTypes.number,
  }).isRequired,
}

export default ExportModal
