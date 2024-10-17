import { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ButtonSecondary, ButtonThatLooksLikeLinkUnderlined } from '../generic'
import { IconClose } from '../../assets/icons'
import {
  AdminIcon,
  CardTitle,
  ContactLink,
  DataSharingIcon,
  HeaderIcon,
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
  const { project_name, project_id, records } = selectedProject
  const projectAdmins = records[0]?.project_admins.map(({ name }) => name).join(', ')
  const projectNotes = records[0]?.project_notes

  const handleClearProject = () => {
    queryParams.delete('project_id')
    setSelectedProject(null)
    updateURLParams(queryParams)
  }

  const _resetTruncateNotesOnProjectChange = useEffect(() => {
    if (!selectedProject) {
      return
    }

    setTruncateNotes(projectNotes.length > MAX_NOTES_LENGTH)
  }, [selectedProject, projectNotes.length])

  console.log(selectedProject)
  return (
    <>
      <ProjectCard>
        <HeaderIcon />
        <ProjectTitle>{project_name}</ProjectTitle>
      </ProjectCard>

      <ButtonSecondary onClick={handleClearProject}>
        <IconClose /> Clear
      </ButtonSecondary>

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
          {projectAdmins}
        </ProjectCardContent>
      </ProjectCard>

      {projectNotes ? (
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
      ) : null}

      <ProjectCard>
        <DataSharingIcon />
        <ProjectCardContent>
          <CardTitle>Data Sharing</CardTitle>
          Sharing content/list goes here
        </ProjectCardContent>
      </ProjectCard>
    </>
  )
}

SelectedProjectMetrics.propTypes = {
  selectedProject: PropTypes.object,
  setSelectedProject: PropTypes.func,
}
