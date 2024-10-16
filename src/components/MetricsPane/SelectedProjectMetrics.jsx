import PropTypes from 'prop-types'
import { ButtonSecondary } from '../generic'
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
import { useContext } from 'react'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'

export const SelectedProjectMetrics = ({ selectedProject, setSelectedProject }) => {
  const getURLParams = () => new URLSearchParams(location.search)
  const queryParams = getURLParams()
  const { updateURLParams } = useContext(FilterProjectsContext)

  const handleClearProject = () => {
    queryParams.delete('project_id')
    setSelectedProject(null)
    updateURLParams(queryParams)
  }

  console.log(selectedProject)
  return (
    <>
      <ProjectCard>
        <HeaderIcon />
        <ProjectTitle>{selectedProject.project_name}</ProjectTitle>
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
              href={`https://datamermaid.org/contact-project?project_id=${selectedProject.project_id}`}
              target="_blank"
            >
              Contact
            </ContactLink>
          </ProjectCardHeader>
          List of admins goes here
        </ProjectCardContent>
      </ProjectCard>

      <ProjectCard>
        <ProjectNotesIcon />
        <ProjectCardContent>
          <CardTitle>Project Notes</CardTitle>
          Notes go here
        </ProjectCardContent>
      </ProjectCard>

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
