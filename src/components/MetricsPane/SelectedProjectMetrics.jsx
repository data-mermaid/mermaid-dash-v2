import { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useAuth0 } from '@auth0/auth0-react'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'

import { EXPORT_METHODS, URL_PARAMS } from '../../constants/constants'
import { toastMessageText } from '../../constants/language'

import { ButtonThatLooksLikeLinkUnderlined, CloseButton, IconButton } from '../generic'
import HideShow from '../Header/components/HideShow'
import SuccessExportModal from '../MermaidDash/components/SuccessExportModal'
import ContactOrUserIcon from './ContactOrUserIcon'

import { IconDownload } from '../../assets/icons'

import { getProtocolSurveyCounts } from '../../helperFunctions/getProtocolSurveyCounts'

import { BiggerIconClose } from './SelectedSiteMetrics.styles'
import {
  AdminIcon,
  CardTitle,
  DataSharingGrid,
  DataSharingIcon,
  HeaderIcon,
  PolicyType,
  PolicyValue,
  ProjectCard,
  ProjectCardContent,
  ProjectCardHeader,
  ProjectExportDataMenu,
  ProjectNotesIcon,
  ProjectTitle,
  ProjectTitleWrapper,
} from './SelectedProjectMetrics.styles'
import {
  ExpressExportMenu,
  ExpressExportMenuHeaderItem,
  ExpressExportMenuItem,
  ExpressExportMenuRow,
} from '../MermaidDash/MermaidDash.styles'

const MAX_NOTES_LENGTH = 250

export const SelectedProjectMetrics = ({ selectedProject, setSelectedProject }) => {
  const getURLParams = () => new URLSearchParams(location.search)
  const queryParams = getURLParams()
  const { updateURLParams } = useContext(FilterProjectsContext)
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [truncateNotes, setTruncateNotes] = useState(true)
  const [isSuccessExportModalOpen, setIsSuccessExportModalOpen] = useState(false)
  const {
    project_name: projectName,
    project_id: projectId,
    project_admins: projectAdmins,
    project_notes: projectNotes,
    data_policy_beltfish: dataSharingBeltfish,
    data_policy_benthiclit: dataSharingBenthiclit,
    data_policy_bleachingqc: dataSharingBleachingqc,
  } = selectedProject
  const protocolSurveyCounts = getProtocolSurveyCounts(selectedProject?.records)

  const handleClearProject = () => {
    queryParams.delete(URL_PARAMS.PROJECT_ID)
    setSelectedProject(null)
    updateURLParams(queryParams)
  }

  const _resetTruncateNotesOnProjectChange = useEffect(() => {
    if (!selectedProject) {
      return
    }

    setTruncateNotes(projectNotes?.length > MAX_NOTES_LENGTH)
  }, [selectedProject, projectNotes])

  const handleExpressExport = async (method) => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : ''

      if (!token) {
        throw new Error('Failed request - no token provided')
      }

      const selectedMethodProtocol = EXPORT_METHODS[method]?.protocol

      const reportEndpoint = `${import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE}/v1/reports/`
      const requestData = {
        report_type: 'summary_sample_unit_method',
        project_ids: [projectId],
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

      setIsSuccessExportModalOpen(true)
    } catch (error) {
      console.error(error)
      toast.error(toastMessageText.sendEmailFailed)
    }
  }

  const renderOverflowExportDataMenu = () => {
    return (
      <ProjectExportDataMenu>
        <ExpressExportMenu>
          <ExpressExportMenuHeaderItem>
            <div>Method</div>
            <div>Number of Surveys</div>
          </ExpressExportMenuHeaderItem>
          {Object.entries(EXPORT_METHODS).map(([method, methodInfo]) => {
            const count = protocolSurveyCounts[method] ?? 0

            return (
              <ExpressExportMenuRow key={method}>
                <ExpressExportMenuItem
                  onClick={() => {
                    handleExpressExport(method)
                  }}
                  disabled={count === 0}
                >
                  <div>{methodInfo.description}</div>
                  <div>{count}</div>
                </ExpressExportMenuItem>
              </ExpressExportMenuRow>
            )
          })}
        </ExpressExportMenu>
      </ProjectExportDataMenu>
    )
  }

  return (
    <>
      <ProjectCard>
        <HeaderIcon />
        <ProjectTitleWrapper>
          <ProjectTitle>{projectName} </ProjectTitle>
          <ContactOrUserIcon projectId={projectId} customStyles={{ iconMarginTop: '5px' }} />
          {isAuthenticated && (
            <HideShow
              button={
                <IconButton style={{ marginTop: '5px' }}>
                  <IconDownload />
                </IconButton>
              }
              contents={renderOverflowExportDataMenu()}
            />
          )}
        </ProjectTitleWrapper>
        <CloseButton type="button" onClick={handleClearProject}>
          <BiggerIconClose />
        </CloseButton>
      </ProjectCard>

      {projectAdmins && (
        <ProjectCard>
          <AdminIcon />
          <ProjectCardContent>
            <ProjectCardHeader>
              <CardTitle>
                Admins <ContactOrUserIcon projectId={projectId} />
              </CardTitle>
            </ProjectCardHeader>
            {projectAdmins?.map(({ name }) => name).join(', ')}
          </ProjectCardContent>
        </ProjectCard>
      )}

      {projectNotes && (
        <ProjectCard>
          <ProjectNotesIcon />
          <ProjectCardContent>
            <CardTitle>Project Notes</CardTitle>
            {truncateNotes ? (
              <>
                {projectNotes.substring(0, MAX_NOTES_LENGTH)}...
                <ButtonThatLooksLikeLinkUnderlined onClick={() => setTruncateNotes(false)}>
                  Read more
                </ButtonThatLooksLikeLinkUnderlined>
              </>
            ) : (
              projectNotes
            )}
          </ProjectCardContent>
        </ProjectCard>
      )}

      {(dataSharingBeltfish || dataSharingBenthiclit || dataSharingBleachingqc) && (
        <ProjectCard>
          <DataSharingIcon />
          <ProjectCardContent>
            <CardTitle>Data Sharing</CardTitle>
            <DataSharingGrid>
              <PolicyType>Fish Belt</PolicyType>
              <PolicyValue>{dataSharingBeltfish}</PolicyValue>
              <PolicyType>Benthic</PolicyType>
              <PolicyValue>{dataSharingBenthiclit}</PolicyValue>
              <PolicyType>Bleaching</PolicyType>
              <PolicyValue>{dataSharingBleachingqc}</PolicyValue>
            </DataSharingGrid>
          </ProjectCardContent>
        </ProjectCard>
      )}

      <SuccessExportModal
        isOpen={isSuccessExportModalOpen}
        onDismiss={() => setIsSuccessExportModalOpen(false)}
      />
    </>
  )
}

SelectedProjectMetrics.propTypes = {
  selectedProject: PropTypes.object,
  setSelectedProject: PropTypes.func,
}
