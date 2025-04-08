import { useContext, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { toast } from 'react-toastify'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import theme from '../../../styles/theme'

import { exportModal, toastMessageText, tooltipText } from '../../../constants/language'
import { Modal, RightFooter, ButtonSecondary, ButtonPrimary, IconButton } from '../../generic'
import { IconUserCircle } from '../../../assets/dashboardOnlyIcons'
import { IconInfo } from '../../../assets/icons'
import { MuiTooltip } from '../../generic/MuiTooltip'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'

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

const ExportGFCRModal = ({ isOpen, onDismiss }) => {
  const { displayedProjects, mermaidUserData, userIsMemberOfProject } =
    useContext(FilterProjectsContext)

  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [modalMode, setModalMode] = useState(null)

  const { projectsWithGFCRData, projectsWithoutGFCRDataCount } = useMemo(() => {
    return displayedProjects.reduce(
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
  }, [displayedProjects])

  const _resetModalModeWhenModalOpenOrClose = useEffect(() => {
    if (isOpen) {
      setModalMode(projectsWithGFCRData.length === 0 ? 'no data' : 'download')
    } else {
      setModalMode(null)
    }
  }, [isOpen, projectsWithGFCRData])

  const title = useMemo(() => {
    const titles = {
      'no data': exportModal.noGFCRDataTitle,
      success: exportModal.successTitle,
      failure: exportModal.failureTitle,
    }

    return titles[modalMode] || exportModal.downloadGFCRTitle
  }, [modalMode])

  const handleSendEmailWithLinkSubmit = async () => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : ''

      if (!token) {
        throw new Error('Failed request - no token provided')
      }

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
        throw new Error(`Failed request - ${response.status}`)
      }

      setModalMode('success')
    } catch (error) {
      console.error(error)
      toast.error(toastMessageText.sendEmailFailed)
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
            {pluralizeWordWithCount(
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

  const MODAL_CONTENT_BY_MODE = {
    'no data': <p>{exportModal.noGFCRDataContent}</p>,
    download: downloadContent,
    success: successContent,
  }

  const mainContent = <>{MODAL_CONTENT_BY_MODE[modalMode] || null}</>

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
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
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={title}
      mainContent={mainContent}
      footerContent={footerContent}
      contentOverflowIsVisible={true}
      modalCustomHeight={modalCustomHeight}
    />
  )
}

ExportGFCRModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ExportGFCRModal
