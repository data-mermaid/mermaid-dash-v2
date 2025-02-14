import { useContext, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'

import { downloadModal } from '../../../constants/language'

import { Modal, RightFooter, ButtonSecondary, ButtonPrimary } from '../../generic'

import { formatDownloadGFCRProjectDataHelper } from '../../../helperFunctions/formatDownloadProjectDataHelper'
import { pluralize } from '../../../helperFunctions/pluralize'

import DownloadGFCRTableView from './DownloadGFCRTableView'
import { IconInfo } from '../../../assets/icons'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
`

const StyledWarningText = styled.div`
  height: 40px;
  display: flex;
  background: lightgrey;
  align-items: center;
  margin-top: 20px;
  padding-left: 20px;
  gap: 5px;
`

const DownloadGFCRModal = ({ modalOpen, handleClose }) => {
  const {
    displayedProjects,
    getActiveProjectCount,
    mermaidUserData,
    checkedProjects,
    userIsMemberOfProject,
  } = useContext(FilterProjectsContext)

  const activeProjectCount = getActiveProjectCount()
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [tableData, setTableData] = useState([])
  const [modalMode, setModalMode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const _resetModalModeWhenModalOpenOrClose = useEffect(() => {
    if (modalOpen) {
      setErrorMessage('')
      setModalMode(activeProjectCount === 0 ? 'no data' : 'download')
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
    const formattedTableData = displayedProjects
      .filter(({ project_id }) => checkedProjects.includes(project_id))
      .map((project, i) => {
        const isMemberOfProject = userIsMemberOfProject(project.project_id, mermaidUserData)
        const formattedData = formatDownloadGFCRProjectDataHelper(project)
        return {
          id: i,
          ...formattedData,
          isMemberOfProject,
          rawProjectData: project,
        }
      })

    setTableData(formattedTableData)
  }, [displayedProjects, checkedProjects, mermaidUserData, userIsMemberOfProject])

  const title = useMemo(() => {
    const titles = {
      'no data': downloadModal.noDataTitle,
      success: downloadModal.successTitle,
      failure: downloadModal.failureTitle,
    }

    return titles[modalMode] || downloadModal.downloadGFCRTitle
  }, [modalMode])

  const handleSendEmailWithLinkSubmit = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : ''

      const projectsToEmail = tableData.map(({ projectId }) => projectId)

      const reportEndpoint = `${import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE}/v1/reports/`
      const requestData = {
        report_type: 'gfcr',
        project_ids: projectsToEmail,
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

  const hasNonGFCRProject = tableData.some((project) => !project.projectIncludeGFCR)
  const downloadContent = (
    <>
      <DownloadGFCRTableView tableData={tableData} />
      {hasNonGFCRProject && (
        <StyledWarningText>
          <IconInfo />{' '}
          <span>
            {pluralize(2, 'other filtered project does', 'other filtered projects do')} not have
            GFCR indicators
          </span>
        </StyledWarningText>
      )}
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

  const modalCustomHeight = useMemo(() => {
    if (modalMode === 'download' && hasNonGFCRProject) {
      return '750px'
    }

    if (modalMode === 'download' && !hasNonGFCRProject) {
      return '700px'
    }
    return '200px'
  }, [modalMode])

  if (!modalMode) {
    return null
  }

  return (
    <Modal
      title={title}
      mainContent={content}
      isOpen={modalOpen}
      onDismiss={handleClose}
      footerContent={footerContent}
      contentOverflowIsVisible={true}
      modalCustomHeight={modalCustomHeight}
    />
  )
}

DownloadGFCRModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

export default DownloadGFCRModal
