import { useContext } from 'react'
import PropTypes from 'prop-types'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import { tooltipText } from '../../constants/language'
import theme from '../../styles/theme'

import { IconUserCircle } from '../../assets/dashboardOnlyIcons'
import { IconContact } from '../../assets/icons'

import { IconButton } from '../generic'
import { MuiTooltip } from '../generic/MuiTooltip'

const ContactOrUserIcon = ({ projectId }) => {
  const { userIsMemberOfProject, mermaidUserData } = useContext(FilterProjectsContext)

  return userIsMemberOfProject(projectId, mermaidUserData) ? (
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
  ) : (
    <MuiTooltip
      title={tooltipText.contactAdmins}
      placement="top"
      bgColor={theme.color.primaryColor}
      tooltipTextColor={theme.color.white}
    >
      <a
        href={`https://datamermaid.org/contact-project?project_id=${projectId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconContact />
      </a>
    </MuiTooltip>
  )
}

ContactOrUserIcon.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default ContactOrUserIcon
