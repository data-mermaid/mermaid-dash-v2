import { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ButtonThatLooksLikeLinkUnderlined, CloseButton } from '../generic'
import { BiggerIconClose } from './SelectedSiteMetrics.styles'
import {
  AdminIcon,
  CardTitle,
  ContactLink,
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
import { FilterProjectsContext } from '../../context/FilterProjectsContext'

const MAX_NOTES_LENGTH = 250

export const SelectedProjectMetrics = ({ selectedProject, setSelectedProject }) => {
  const getURLParams = () => new URLSearchParams(location.search)
  const queryParams = getURLParams()
  const { updateURLParams } = useContext(FilterProjectsContext)

  const [truncateNotes, setTruncateNotes] = useState(true)
  const {
    project_name,
    project_id,
    project_admins,
    project_notes,
    data_policy_beltfish,
    data_policy_benthiclit,
    data_policy_bleachingqc,
  } = selectedProject

  const handleClearProject = () => {
    queryParams.delete('project_id')
    setSelectedProject(null)
    updateURLParams(queryParams)
  }

  const _resetTruncateNotesOnProjectChange = useEffect(() => {
    if (!selectedProject) {
      return
    }

    setTruncateNotes(project_notes?.length > MAX_NOTES_LENGTH)
  }, [selectedProject, project_notes])

  return (
    <>
      <ProjectCard>
        <HeaderIcon />
        <ProjectTitle>{project_name}</ProjectTitle>
        <CloseButton type="button" onClick={handleClearProject}>
          <BiggerIconClose />
        </CloseButton>
      </ProjectCard>

      {project_admins && (
        <ProjectCard>
          <AdminIcon />
          <ProjectCardContent>
            <ProjectCardHeader>
              <CardTitle>Admins</CardTitle>
              <ContactLink
                href={`https://datamermaid.org/contact-project?project_id=${project_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </ContactLink>
            </ProjectCardHeader>
            {project_admins?.map(({ name }) => name).join(', ')}
          </ProjectCardContent>
        </ProjectCard>
      )}

      {project_notes && (
        <ProjectCard>
          <ProjectNotesIcon />
          <ProjectCardContent>
            <CardTitle>Project Notes</CardTitle>
            {truncateNotes ? (
              <>
                {project_notes.substring(0, MAX_NOTES_LENGTH)}...
                <ButtonThatLooksLikeLinkUnderlined onClick={() => setTruncateNotes(false)}>
                  Read more
                </ButtonThatLooksLikeLinkUnderlined>
              </>
            ) : (
              project_notes
            )}
          </ProjectCardContent>
        </ProjectCard>
      )}

      {(data_policy_beltfish || data_policy_benthiclit || data_policy_bleachingqc) && (
        <ProjectCard>
          <DataSharingIcon />
          <ProjectCardContent>
            <CardTitle>Data Sharing</CardTitle>
            <DataSharingGrid>
              <PolicyType>Fish Belt</PolicyType>
              <PolicyValue>{data_policy_beltfish || ''}</PolicyValue>
              <PolicyType>Benthic</PolicyType>
              <PolicyValue>{data_policy_benthiclit || ''}</PolicyValue>
              <PolicyType>Bleaching</PolicyType>
              <PolicyValue>{data_policy_bleachingqc || ''}</PolicyValue>
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
