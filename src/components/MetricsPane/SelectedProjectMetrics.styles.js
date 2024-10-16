import styled, { css } from 'styled-components'
import theme from '../../styles/theme'
import { HamburgerMenu, IconTextBoxMultiple } from '../../assets/dashboardOnlyIcons'
import { IconSharing, IconUser } from '../../assets/icons'

export const ProjectCard = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  background-color: ${theme.color.white};
`

export const ProjectTitle = styled.h2`
  margin: 0;
`

export const ProjectCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ProjectCardHeader = styled.div`
  display: flex;
  gap: 1rem;
`

export const CardTitle = styled.span`
  font-weight: bold;
`

export const ContactLink = styled.a`
  color: ${theme.color.primaryColor};
`

const iconSize = css`
  width: ${theme.typography.mediumIconSize};
  height: ${theme.typography.mediumIconSize};
  flex-shrink: 0;
`

export const HeaderIcon = styled(IconTextBoxMultiple)`
  ${iconSize};
`
export const AdminIcon = styled(IconUser)`
  ${iconSize};
`

export const ProjectNotesIcon = styled(HamburgerMenu)`
  ${iconSize};
`

export const DataSharingIcon = styled(IconSharing)`
  ${iconSize};
`
