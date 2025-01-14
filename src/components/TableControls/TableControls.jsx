import { useContext, useRef } from 'react'
import { CSVLink } from 'react-csv'

import styled from 'styled-components'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'

import theme from '../../styles/theme'
import { IconTrayDownload } from '../../assets/dashboardOnlyIcons'
import { formatProjectDataHelper } from '../../helperFunctions'

import { ButtonSecondary } from '../generic'

const ButtonSecondaryWithMargin = styled(ButtonSecondary)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0 2rem;
`

const ZeroSurveysButton = styled(ButtonSecondary)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${theme.color.secondaryBorder};
  width: 27rem;
  cursor: pointer;
`

const StyledLabel = styled.label`
  cursor: pointer;
`

const StyledCSVLink = styled(CSVLink)`
  display: none;
`

const TableControlContainer = styled.div`
  position: absolute;
  top: 6.1rem;
  left: 1.1rem;
  height: 4rem;
  z-index: 1;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`
const TableControls = () => {
  const csvLinkRef = useRef()

  const {
    checkedProjects,
    displayedProjects,
    setShowProjectsWithNoRecords,
    showProjectsWithNoRecords,
  } = useContext(FilterProjectsContext)

  const tableHeaders = [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Date Range', key: 'formattedDateRange' },
    { label: 'Countries', key: 'countries' },
    { label: 'Organizations', key: 'organizations' },
    { label: 'Surveys', key: 'surveyCount' },
    { label: 'Transects', key: 'transects' },
  ]

  const tableContent = displayedProjects
    .map((project) => {
      if (!checkedProjects.includes(project.project_id)) {
        return null
      }
      const { projectName, formattedDateRange, countries, organizations, surveyCount, transects } =
        formatProjectDataHelper(project)
      const formattedTableRowData = {
        projectName,
        formattedDateRange,
        countries,
        organizations,
        recordCount: project.records.length,
        surveyCount,
        transects,
      }
      return formattedTableRowData
    })
    .filter((project) => project)

  const downloadedFileName = () => {
    const formattedDate = new Date().toISOString().slice(0, 10)
    return `mermaid_projects_${formattedDate}.csv`
  }

  const handleDownload = () => {
    csvLinkRef.current.link.click()
  }

  const handleShowProjectsWithNoRecords = () => {
    setShowProjectsWithNoRecords(!showProjectsWithNoRecords)
  }

  return (
    <TableControlContainer>
      <ButtonSecondaryWithMargin onClick={handleDownload}>
        <IconTrayDownload />
        <span>Download</span>
      </ButtonSecondaryWithMargin>
      <StyledCSVLink
        data={tableContent}
        headers={tableHeaders}
        filename={downloadedFileName()}
        ref={csvLinkRef}
      />
      <ZeroSurveysButton onClick={handleShowProjectsWithNoRecords}>
        <input
          type="checkbox"
          id="show-0-projects"
          checked={showProjectsWithNoRecords}
          onChange={handleShowProjectsWithNoRecords}
        />
        <StyledLabel htmlFor="show-0-projects" onClick={(e) => e.stopPropagation()}>
          Show projects with 0 surveys
        </StyledLabel>
      </ZeroSurveysButton>
    </TableControlContainer>
  )
}

export default TableControls
