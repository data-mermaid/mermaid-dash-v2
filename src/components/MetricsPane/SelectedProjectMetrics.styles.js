import styled, { css } from 'styled-components'
import theme from '../../styles/theme'
import { IconTextBoxMultiple } from '../../assets/dashboardOnlyIcons'
import { IconNotes, IconSharing, IconUser } from '../../assets/icons'

export const ProjectCard = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  background-color: ${theme.color.white};
`

export const ProjectTitleWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  gap: 1rem;
  align-items: flex-start;
`
export const ProjectTitle = styled.h2`
  margin: 0;
  max-width: 200px;
  overflow-wrap: break-word;
`

export const ProjectCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
  overflow-x: hidden;
  overflow-wrap: anywhere;
  width: 100%;
`

export const ProjectCardHeader = styled.div`
  display: flex;
  gap: 1rem;
`

export const CardTitle = styled.span`
  font-weight: bold;
`

export const DataSharingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
`

export const PolicyType = styled.span`
  font-weight: bold;
`

export const PolicyValue = styled.span`
  text-transform: capitalize;
`

const iconSize = css`
  width: ${theme.typography.mediumIconSize};
  height: ${theme.typography.mediumIconSize};
  flex-shrink: 0;
`

export const HeaderIcon = styled(IconTextBoxMultiple)`
  ${iconSize};
  margin-top: 0.6rem;
`
export const AdminIcon = styled(IconUser)`
  ${iconSize};
`

export const ProjectNotesIcon = styled(IconNotes)`
  ${iconSize};
`

export const DataSharingIcon = styled(IconSharing)`
  ${iconSize};
`

export const ProjectExportDataMenu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  right: 0px;
  width: 260px;
  border: 1px solid ${theme.color.grey0};
  z-index: 2;
`
