import { useContext, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import theme from '../../../styles/theme'

import { downloadModal, tooltipText } from '../../../constants/language'
import { Modal, RightFooter, ButtonSecondary, ButtonPrimary, IconButton } from '../../generic'
import { IconUserCircle } from '../../../assets/dashboardOnlyIcons'
import { IconInfo } from '../../../assets/icons'
import { MuiTooltip } from '../../generic/MuiTooltip'
import { pluralize } from '../../../helperFunctions/pluralize'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
`

const StyledOverflowList = styled.ul`
  height: 244px;
  overflow-y: auto;
`

const StyledWarningText = styled.div`
  height: 40px;
  display: flex;
  background: lightgrey;
  align-items: center;
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
  const [modalMode, setModalMode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { projectsWithGFCRData, projectsWithoutGFCRDataCount } = useMemo(() => {
    return displayedProjects
      .filter(({ project_id }) => checkedProjects.includes(project_id))
      .reduce(
        (acc, project) => {
          if (project.project_includes_gfcr) {
            acc.projectsWithGFCRData.push(project)
          } else {
            acc.projectsWithoutGFCRDataCount++
          }
          return acc
        },
        { projectsWithGFCRData: [], projectsWithoutGFCRDataCount: 0 },
      )
  }, [displayedProjects, checkedProjects])

  const _resetModalModeWhenModalOpenOrClose = useEffect(() => {
    if (modalOpen) {
      setErrorMessage('')
      setModalMode(projectsWithGFCRData?.length === 0 ? 'no data' : 'download')
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

  const title = useMemo(() => {
    const titles = {
      'no data': downloadModal.noGFCRDataTitle,
      success: downloadModal.successTitle,
      failure: downloadModal.failureTitle,
    }

    return titles[modalMode] || downloadModal.downloadGFCRTitle
  }, [modalMode])

  const handleSendEmailWithLinkSubmit = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : ''

      const projectsToEmail = projectsWithGFCRData.map(({ project_id }) => project_id)

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

  const projectListWithGFCRData = projectsWithGFCRData.map((project) => {
    return (
      <li key={project.project_id}>
        {project.project_name}{' '}
        {userIsMemberOfProject(project.project_id, mermaidUserData) && (
          <MuiTooltip
            title={tooltipText.yourProject}
            placement="top"
            bgColor={theme.color.primaryColor}
            tooltipTextColor={theme.color.white}
          >
            <IconButton>
              <IconUserCircle />
            </IconButton>
          </MuiTooltip>
        )}
      </li>
    )
  })

  const downloadContent = (
    <>
      <StyledOverflowList>{projectListWithGFCRData}</StyledOverflowList>
      {projectsWithoutGFCRDataCount > 0 && (
        <StyledWarningText>
          <IconInfo />{' '}
          <span>
            {pluralize(
              projectsWithoutGFCRDataCount,
              'other filtered project does',
              'other filtered projects do',
            )}{' '}
            not have GFCR indicators
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
      {modalMode === 'no data' && <p>{downloadModal.noGFCRDataContent}</p>}
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
    if (modalMode === 'download' && projectsWithoutGFCRDataCount > 0) {
      return '420px'
    }

    if (modalMode === 'download' && projectsWithoutGFCRDataCount === 0) {
      return '400px'
    }

    return '200px'
  }, [modalMode, projectsWithoutGFCRDataCount])

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
