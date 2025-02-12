import { useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useAuth0 } from '@auth0/auth0-react'
import { FormControl } from '@mui/material'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'

import theme from '../../../styles/theme'

import { DOWNLOAD_METHODS } from '../../../constants/constants'
import { downloadModal } from '../../../constants/language'

import { Modal, RightFooter, ButtonSecondary, ButtonPrimary } from '../../generic'
import { MermaidMenuItem, MermaidOutlinedInput, MermaidSelect } from '../../generic/MermaidMui'
import { StyledHeader } from '../../MetricsPane/MetricsPane.styles'
import DownloadTableView from './DownloadTable'
import { formatDownloadProjectDataHelper } from '../../../helperFunctions/formatDownloadProjectDataHelper'
import { pluralize } from '../../../helperFunctions/pluralize'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
  color: ${theme.color.black};
`

const StyledDataSharingButton = styled(ButtonSecondary)`
  background-color: ${({ isActive }) => (isActive ? theme.color.primaryColor : theme.color.white)};
  color: ${({ isActive }) => (isActive ? theme.color.white : theme.color.black)};
`
const getSurveyedMethod = (countObj) => {
  const customSortOrder = [
    'colonies_bleached',
    'benthicpit',
    'benthiclit',
    'benthicpqt',
    'habitatcomplexity',
    'quadrat_benthic_percent',
  ]

  if (countObj.beltfish > 0) return 'beltfish'

  return (
    Object.entries(countObj)
      .filter(([, value]) => value > 0)
      .sort((a, b) => customSortOrder.indexOf(a[0]) - customSortOrder.indexOf(b[0]))
      .map(([key]) => key)[0] || 'beltfish'
  )
}

const DownloadModal = ({ modalOpen, handleClose }) => {
  const {
    displayedProjects,
    filteredSurveys,
    getActiveProjectCount,
    userIsMemberOfProject,
    mermaidUserData,
    checkedProjects,
  } = useContext(FilterProjectsContext)

  const surveyedMethodCount = filteredSurveys.reduce((acc, record) => {
    const protocols = record.protocols || {}

    Object.keys(protocols).map((protocol) => {
      if (acc[protocol]) {
        acc[protocol] += 1
      } else {
        acc[protocol] = 1
      }
    })

    return acc
  }, {})

  const activeProjectCount = getActiveProjectCount()
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [tableData, setTableData] = useState([])
  const [selectedDataSharing, setSelectedDataSharing] = useState('public')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [modalMode, setModalMode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const collectionMethods = Object.entries(DOWNLOAD_METHODS)

  const _resetModalModeWhenModalOpenOrClose = useEffect(() => {
    if (modalOpen) {
      setErrorMessage('')
      setModalMode(activeProjectCount === 0 ? 'no data' : 'download')
      setSelectedMethod(getSurveyedMethod(surveyedMethodCount))
    } else {
      setModalMode('')
    }
  }, [modalOpen, activeProjectCount])

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

  const _getSiteRecords = useEffect(() => {
    if (!selectedMethod) return

    const formattedTableData = displayedProjects
      .filter(({ project_id }) => checkedProjects.includes(project_id))
      .map((project, i) => {
        const isMemberOfProject = userIsMemberOfProject(project.project_id, mermaidUserData)
        const formattedData = formatDownloadProjectDataHelper(
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

    setTableData(formattedTableData)
  }, [displayedProjects, selectedMethod, selectedDataSharing, checkedProjects])

  const title = useMemo(() => {
    const titles = {
      'no data': downloadModal.noDataTitle,
      success: downloadModal.successTitle,
      failure: downloadModal.failureTitle,
    }

    return titles[modalMode] || downloadModal.downloadTitle
  }, [modalMode])

  const handleSendEmailWithLinkSubmit = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : ''

      const selectedMethodProtocol = DOWNLOAD_METHODS[selectedMethod]?.protocol
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
        setErrorMessage(downloadModal.failureContent)
        setModalMode('failure')
        return
      }

      setModalMode('success')
    } catch {
      setErrorMessage(downloadModal.failureContent)
      setModalMode('failure')
    }
  }

  const handleDataSharingChange = (e) => {
    setSelectedDataSharing(e.target.value)
  }

  const handleSelectedMethodChange = (e) => setSelectedMethod(e.target.value)

  const downloadContent = (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          background: '#f8f8fa',
          paddingTop: 0,
          paddingBottom: '30px',
          gap: '5px',
        }}
      >
        <FormControl style={{ width: '30rem' }}>
          <StyledHeader>Method</StyledHeader>
          <MermaidSelect
            input={<MermaidOutlinedInput />}
            value={selectedMethod}
            onChange={handleSelectedMethodChange}
          >
            {collectionMethods.map(([key, method]) => {
              return (
                <MermaidMenuItem key={key} value={key}>
                  {method.description}{' '}
                  {`(${pluralize(surveyedMethodCount[key] || 0, 'Survey', 'Surveys')})`}
                </MermaidMenuItem>
              )
            })}
          </MermaidSelect>
        </FormControl>
        <div style={{ flexGrow: 1 }}>
          <StyledHeader>Project Data Sharing</StyledHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StyledDataSharingButton
              value={'private'}
              isActive={selectedDataSharing === 'private'}
              onClick={handleDataSharingChange}
            >
              Private
            </StyledDataSharingButton>
            <StyledDataSharingButton
              style={{ width: '150px' }}
              value={'public summary'}
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
          </div>
        </div>
        <span>Find out how your data are shared</span>
      </div>
      <DownloadTableView tableData={tableData} />
    </>
  )

  const successContent = (
    <>
      <p>An email has been sent to {mermaidUserData.email}</p>
      <p>This can sometimes take up to 15 minutes</p>
    </>
  )

  const content = (
    <ModalBody>
      {modalMode === 'no data' && <p>{downloadModal.noDataContent}</p>}
      {modalMode === 'download' && downloadContent}
      {modalMode === 'success' && successContent}
      {modalMode === 'failure' && <p>{errorMessage}</p>}
    </ModalBody>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleClose}>Close</ButtonSecondary>
      {modalMode === 'download' && (
        <ButtonPrimary onClick={handleSendEmailWithLinkSubmit}>Send Email With Link</ButtonPrimary>
      )}
    </RightFooter>
  )

  if (!modalMode) return null

  return (
    <Modal
      title={title}
      mainContent={content}
      isOpen={modalOpen}
      onDismiss={handleClose}
      footerContent={footerContent}
      contentOverflowIsVisible={true}
      modalCustomWidth={modalMode === 'download' ? '1200px' : '600px'}
      modalCustomHeight={modalMode === 'download' ? '700px' : '200px'}
    />
  )
}

export default DownloadModal
