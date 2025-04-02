import { useContext, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { FormControl } from '@mui/material'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import theme from '../../../styles/theme'

import { EXPORT_METHODS } from '../../../constants/constants'
import { exportModal, toastMessageText } from '../../../constants/language'

import {
  Modal,
  RightFooter,
  ButtonSecondary,
  ButtonPrimary,
  ButtonThatLooksLikeLinkUnderlined,
} from '../../generic'
import { MermaidMenuItem, MermaidOutlinedInput, MermaidSelect } from '../../generic/MermaidMui'
import { StyledHeader } from '../../MetricsPane/MetricsPane.styles'

import { formatExportProjectDataHelper } from '../../../helperFunctions/formatExportProjectDataHelper'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

import ExportTableView from './ExportTableView'
import DataSharingInfoModal from './DataSharingInfoModal'
import { IconInfo } from '../../../assets/icons'
import { LeftFooter } from '../../generic/Modal'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
`

const StyledExportContentWrapper = styled.div`
  display: flex;
  align-items: end;
  padding-top: 0;
  padding-bottom: 30px;
  gap: 5px;
`

const StyledDataSharingWrapper = styled.div`
  flex-grow: 1;
`

const StyledDataSharingTabs = styled.div`
  display: flex;
  align-items: center;
`

const StyledDataSharingButton = styled(ButtonPrimary)`
  border: 1px solid ${theme.color.secondaryBorder};
  width: ${({ customWidth = 'auto' }) => customWidth};
  background-color: ${({ isActive }) => (isActive ? theme.color.primaryColor : theme.color.white)};
  color: ${({ isActive }) => (isActive ? theme.color.white : theme.color.black)};
`

const WiderFormControl = styled(FormControl)`
  width: 30rem;
`

const StyledWarningText = styled.div`
  height: 40px;
  display: flex;
  background: lightgrey;
  align-items: center;
  padding: 0 5px;
`

const ExportModal = ({
  isOpen,
  onDismiss,
  surveyedMethodCount,
  selectedMethod,
  handleSelectedMethodChange,
}) => {
  const { displayedProjects, getActiveProjectCount, userIsMemberOfProject, mermaidUserData } =
    useContext(FilterProjectsContext)

  const activeProjectCount = getActiveProjectCount()
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [tableData, setTableData] = useState([])
  const [selectedDataSharing, setSelectedDataSharing] = useState('public')
  const [modalMode, setModalMode] = useState(null)
  const [isDataSharingModalOpen, setIsDataSharingModalOpen] = useState(false)
  const [projectWithoutSurveyCount, setProjectWithoutSurveyCount] = useState(0)

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

    const formattedTableData = displayedProjects.map((project, i) => {
      const isMemberOfProject = userIsMemberOfProject(project.project_id, mermaidUserData)
      const formattedData = formatExportProjectDataHelper(
        project,
        isMemberOfProject,
        selectedMethod,
        selectedDataSharing,
      )

      return {
        id: i,
        ...formattedData,
        isMemberOfProject,
        rawProjectData: project,
      }
    })

    const projectsWithoutSurveyData =
      formattedTableData.filter((data) => data.surveyCount === 0) ?? 0

    setProjectWithoutSurveyCount(projectsWithoutSurveyData.length)
    setTableData(formattedTableData)
  }, [
    displayedProjects,
    selectedMethod,
    selectedDataSharing,
    mermaidUserData,
    userIsMemberOfProject,
  ])

  const title = useMemo(() => {
    const titles = {
      'no data': exportModal.noDataTitle,
      success: exportModal.successTitle,
      failure: exportModal.failureTitle,
    }

    return titles[modalMode] || exportModal.exportTitle
  }, [modalMode])

  const handleSendEmailWithLinkSubmit = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : ''

      if (!token) {
        throw new Error('Failed request - No token provided')
      }

      const selectedMethodProtocol = EXPORT_METHODS[selectedMethod]?.protocol
      const projectsToEmail = tableData
        .filter(
          ({ metaData, surveyData, observationData }) => metaData || surveyData || observationData,
        )
        .map(({ projectId }) => projectId)

      const reportEndpoint = `${import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE}/v1/reports/`
      const requestData = {
        report_type: 'summary_sample_unit_method',
        project_ids: projectsToEmail,
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
      toast.error(toastMessageText.sendEmailFailed)
    }
  }

  const handleDataSharingChange = (e) => {
    setSelectedDataSharing(e.target.value)
  }

  const exportContent = (
    <>
      <StyledExportContentWrapper>
        <WiderFormControl>
          <StyledHeader>Method</StyledHeader>
          <MermaidSelect
            input={<MermaidOutlinedInput />}
            value={selectedMethod}
            onChange={handleSelectedMethodChange}
          >
            {Object.entries(EXPORT_METHODS).map(([key, method]) => {
              return (
                <MermaidMenuItem key={key} value={key}>
                  {method.description}{' '}
                  {`(${pluralizeWordWithCount(surveyedMethodCount[key] ?? 0, 'Survey')})`}
                </MermaidMenuItem>
              )
            })}
          </MermaidSelect>
        </WiderFormControl>
        <StyledDataSharingWrapper>
          <StyledHeader>Project Data Sharing</StyledHeader>
          <StyledDataSharingTabs>
            <StyledDataSharingButton
              value={'private'}
              isActive={selectedDataSharing === 'private'}
              onClick={handleDataSharingChange}
            >
              Private
            </StyledDataSharingButton>
            <StyledDataSharingButton
              value={'public summary'}
              customWidth={'150px'}
              isActive={selectedDataSharing === 'public summary'}
              onClick={handleDataSharingChange}
            >
              Public Summary
            </StyledDataSharingButton>
            <StyledDataSharingButton
              value={'public'}
              isActive={selectedDataSharing === 'public'}
              onClick={handleDataSharingChange}
            >
              Public
            </StyledDataSharingButton>
          </StyledDataSharingTabs>
        </StyledDataSharingWrapper>
        <ButtonThatLooksLikeLinkUnderlined onClick={() => setIsDataSharingModalOpen(true)}>
          Find out how your data are shared
        </ButtonThatLooksLikeLinkUnderlined>
      </StyledExportContentWrapper>
      <ExportTableView tableData={tableData} />
      <DataSharingInfoModal
        isOpen={isDataSharingModalOpen}
        onDismiss={() => setIsDataSharingModalOpen(false)}
      />
    </>
  )

  const successContent = (
    <>
      <p>An email has been sent to {mermaidUserData.email}</p>
      <p>This can sometimes take up to 15 minutes</p>
    </>
  )

  const MODAL_CONTENT_BY_MODE = {
    'no data': <p>{exportModal.noDataContent}</p>,
    export: exportContent,
    success: successContent,
  }

  const content = <ModalBody>{MODAL_CONTENT_BY_MODE[modalMode] || null}</ModalBody>

  const footerContent = (
    <>
      {modalMode === 'export' && (
        <LeftFooter>
          <StyledWarningText>
            <span>
              <IconInfo />{' '}
              {pluralizeWordWithCount(
                projectWithoutSurveyCount,
                'other project does ',
                'other projects do ',
              )}
              not have {EXPORT_METHODS[selectedMethod]?.description} data or you don&apos;t have
              access for the selected data sharing.
            </span>
          </StyledWarningText>
        </LeftFooter>
      )}
      <RightFooter>
        <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
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
      title={title}
      mainContent={content}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footerContent={footerContent}
      contentOverflowIsVisible={true}
    />
  )
}

ExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  selectedMethod: PropTypes.string.isRequired,
  handleSelectedMethodChange: PropTypes.func.isRequired,
  surveyedMethodCount: PropTypes.object.isRequired,
}

export default ExportModal
