import { useContext } from 'react'
import PropTypes from 'prop-types'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import { tooltipText } from '../../constants/language'
import theme from '../../styles/theme'

import { IconUserCircle } from '../../assets/dashboardOnlyIcons'
import { IconContact } from '../../assets/icons'

import { IconButton } from '../generic'
import { ResponsiveTooltip } from '../generic/ResponsiveTooltip'

const ContactOrUserIcon = ({ projectId, customStyles = {} }) => {
  const { userIsMemberOfProject, mermaidUserData } = useContext(FilterProjectsContext)
  const iconMarginTop = customStyles?.iconMarginTop || '0px'

  return userIsMemberOfProject(projectId, mermaidUserData) ? (
    <ResponsiveTooltip
      title={tooltipText.yourProject}
      placement="top"
      bgColor={theme.color.primaryColor}
      tooltipTextColor={theme.color.white}
    >
      <IconButton style={{ marginTop: iconMarginTop }}>
        <IconUserCircle />
      </IconButton>
    </ResponsiveTooltip>
  ) : (
    <ResponsiveTooltip
      title={tooltipText.contactAdmins}
      placement="top"
      bgColor={theme.color.primaryColor}
      tooltipTextColor={theme.color.white}
    >
      <a
        href={`https://datamermaid.org/contact-project?project_id=${projectId}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: iconMarginTop }}
      >
        <IconContact />
      </a>
    </ResponsiveTooltip>
  )
}

ContactOrUserIcon.propTypes = {
  projectId: PropTypes.string.isRequired,
  customStyles: PropTypes.shape({
    iconMarginTop: PropTypes.string,
  }),
}

export default ContactOrUserIcon
