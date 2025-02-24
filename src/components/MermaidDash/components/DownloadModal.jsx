import { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useAuth0 } from '@auth0/auth0-react'
import { FormControl } from '@mui/material'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import theme from '../../../styles/theme'

import { DOWNLOAD_METHODS } from '../../../constants/constants'
import { downloadModal } from '../../../constants/language'

import {
  Modal,
  RightFooter,
  ButtonSecondary,
  ButtonPrimary,
  ButtonThatLooksLikeLinkUnderlined,
} from '../../generic'
import { MermaidMenuItem, MermaidOutlinedInput, MermaidSelect } from '../../generic/MermaidMui'
import { StyledHeader } from '../../MetricsPane/MetricsPane.styles'

import { formatDownloadProjectDataHelper } from '../../../helperFunctions/formatDownloadProjectDataHelper'
import { pluralize } from '../../../helperFunctions/pluralize'

import DownloadTableView from './DownloadTableView'
import DataSharingInfoModal from './DataSharingInfoModal'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
`

const StyledDownloadContentWrapper = styled.div`
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

const getSurveyedMethod = (countObj) => {
  const customSortOrder = [
    'colonies_bleached',
    'benthicpit',
    'benthiclit',
    'benthicpqt',
    'habitatcomplexity',
    'quadrat_benthic_percent',
  ]

  if (countObj.beltfish > 0) {
    return 'beltfish'
  }

  return (
    Object.entries(countObj)
      .filter(([, value]) => value > 0)
      .sort((a, b) => customSortOrder.indexOf(a[0]) - customSortOrder.indexOf(b[0]))
      .map(([key]) => key)[0] || 'beltfish'
  )
}

const DownloadModal = ({ isOpen, onDismiss }) => {
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
  const [modalMode, setModalMode] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isDataSharingModalOpen, setIsDataSharingModalOpen] = useState(false)

  const collectionMethods = Object.entries(DOWNLOAD_METHODS)

  const _resetModalModeWhenModalOpenOrClose = useEffect(() => {
    if (isOpen) {
      setErrorMessage(null)
      setModalMode(activeProjectCount === 0 ? 'no data' : 'download')
      setSelectedMethod(getSurveyedMethod(surveyedMethodCount))
    } else {
      setModalMode(null)
    }
  }, [isOpen, activeProjectCount])

  const _getSiteRecords = useEffect(() => {
    if (!selectedMethod) {
      return
    }

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
  }, [
    displayedProjects,
    selectedMethod,
    selectedDataSharing,
    checkedProjects,
    mermaidUserData,
    userIsMemberOfProject,
  ])

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

      if (!token) {
        setErrorMessage(downloadModal.failureContent)
        setModalMode('failure')
        return
      }

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
      <StyledDownloadContentWrapper>
        <WiderFormControl>
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
      </StyledDownloadContentWrapper>
      <DownloadTableView tableData={tableData} />
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
    'no data': <p>{downloadModal.noDataContent}</p>,
    download: downloadContent,
    success: successContent,
    failure: <p>{errorMessage}</p>,
  }

  const content = <ModalBody>{MODAL_CONTENT_BY_MODE[modalMode] || null}</ModalBody>

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
      {modalMode === 'download' && (
        <ButtonPrimary onClick={handleSendEmailWithLinkSubmit}>Send Email With Link</ButtonPrimary>
      )}
    </RightFooter>
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
      modalCustomWidth={modalMode === 'download' ? '1150px' : '600px'}
      modalCustomHeight={modalMode === 'download' ? '750px' : '200px'}
    />
  )
}

DownloadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default DownloadModal
