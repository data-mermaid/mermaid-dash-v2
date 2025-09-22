import { useContext, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { FilterProjectsContext } from '../../../context/FilterProjectsContext'
import theme from '../../../styles/theme'

import { Modal, RightFooter, ButtonSecondary, ButtonPrimary, IconButton } from '../../generic'
import { IconUserCircle } from '../../../assets/dashboardOnlyIcons'
import { IconInfo } from '../../../assets/icons'
import { MuiTooltip } from '../../generic/MuiTooltip'
import { pluralizeWordWithCount } from '../../../helperFunctions/pluralize'
import { LeftFooter } from '../../generic/Modal'

const StyledOverflowList = styled.ul`
  height: 244px;
  overflow-y: auto;
`

const StyledWarningText = styled.div`
  height: 36px;
  display: flex;
  background-color: ${theme.color.white2};
  align-items: center;
  padding: 0px 10px;
  gap: 5px;
  font-size: ${theme.typography.smallFontSize};
`

const ExportGFCRModal = ({ isOpen, onDismiss }) => {
  const { displayedProjects, mermaidUserData, userIsMemberOfProject } =
    useContext(FilterProjectsContext)
  const { t } = useTranslation()

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
      setModalMode(projectsWithGFCRData.length === 0 ? 'no data' : 'export')
    } else {
      setModalMode(null)
    }
  }, [isOpen, projectsWithGFCRData])

  const titleByMode = (() => {
    const titles = {
      'no data': t('no_gfcr_data_export'),
      success: t('export_request_sent'),
      failure: t('export_request_failed'),
    }

    return titles[modalMode] || t('export_gfcr_data')
  })()

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
      toast.error(t('errors.send_email_failed'))
    }
  }

  const projectListWithGFCRData = projectsWithGFCRData.map((project) => {
    return (
      <li key={project.project_id}>
        {project.project_name}{' '}
        {userIsMemberOfProject(project.project_id, mermaidUserData) && (
          <MuiTooltip
            title={t('your_projects')}
            placement="top"
            bgColor={`${theme.color.primaryColor}`}
            tooltipTextColor={`${theme.color.white}`}
          >
            <IconButton>
              <IconUserCircle />
            </IconButton>
          </MuiTooltip>
        )}
      </li>
    )
  })

  const exportContent = <StyledOverflowList>{projectListWithGFCRData}</StyledOverflowList>

  const successContent = (
    <>
      <p>{t('email_confirmation', { email: mermaidUserData.email })} </p>
    </>
  )

  const MODAL_CONTENT_BY_MODE = {
    'no data': <p>{t('no_gfcr_projects')}</p>,
    export: exportContent,
    success: successContent,
  }

  const mainContent = <>{MODAL_CONTENT_BY_MODE[modalMode] || null}</>

  const footerContent = (
    <>
      {modalMode === 'export' && projectsWithoutGFCRDataCount > 0 && (
        <LeftFooter>
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

  const modalCustomHeight = modalMode === 'export' ? '340px' : '200px'

  if (!modalMode) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={titleByMode}
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
