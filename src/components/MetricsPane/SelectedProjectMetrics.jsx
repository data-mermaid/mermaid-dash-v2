import { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'

import { URL_PARAMS } from '../../constants/constants'

import { ButtonThatLooksLikeLinkUnderlined, CloseButton } from '../generic'
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
  ProjectNotesIcon,
  ProjectTitle,
} from './SelectedProjectMetrics.styles'
import ContactOrUserIcon from './ContactOrUserIcon'

const MAX_NOTES_LENGTH = 250

export const SelectedProjectMetrics = ({ selectedProject, setSelectedProject }) => {
  const getURLParams = () => new URLSearchParams(location.search)
  const queryParams = getURLParams()
  const { updateURLParams } = useContext(FilterProjectsContext)

  const [truncateNotes, setTruncateNotes] = useState(true)
  const {
    project_name: projectName,
    project_id: projectId,
    project_admins: projectAdmins,
    project_notes: projectNotes,
    data_policy_beltfish: dataSharingBeltfish,
    data_policy_benthiclit: dataSharingBenthiclit,
    data_policy_bleachingqc: dataSharingBleachingqc,
  } = selectedProject

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

  return (
    <>
      <ProjectCard>
        <HeaderIcon />
        <ProjectTitle>{projectName}</ProjectTitle>
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
    </>
  )
}

SelectedProjectMetrics.propTypes = {
  selectedProject: PropTypes.object,
  setSelectedProject: PropTypes.func,
}
