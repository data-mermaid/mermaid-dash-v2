import { useContext } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { FilterProjectsContext } from '../../context/FilterProjectsContext'
import theme from '../../styles/theme'

import { IconUserCircle } from '../../assets/dashboardOnlyIcons'
import { IconContact } from '../../assets/icons'

import { IconButton } from '../generic'
import { MuiTooltip } from '../generic/MuiTooltip'

const ContactOrUserIcon = ({ projectId, customStyles = {} }) => {
  const { userIsMemberOfProject, mermaidUserData } = useContext(FilterProjectsContext)
  const { t } = useTranslation()
  const iconMarginTop = customStyles?.iconMarginTop || '0px'

  return userIsMemberOfProject(projectId, mermaidUserData) ? (
    <MuiTooltip
      title={t('your_projects')}
      placement="top"
      bgColor={theme.color.primaryColor}
      tooltipTextColor={theme.color.white}
    >
      <IconButton style={{ marginTop: iconMarginTop }}>
        <IconUserCircle />
      </IconButton>
    </MuiTooltip>
  ) : (
    <MuiTooltip
      title={t('contact_admins')}
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
    </MuiTooltip>
  )
}

ContactOrUserIcon.propTypes = {
  projectId: PropTypes.string.isRequired,
  customStyles: PropTypes.shape({
    iconMarginTop: PropTypes.string,
  }),
}

export default ContactOrUserIcon
