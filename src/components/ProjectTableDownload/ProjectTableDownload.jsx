import { useContext, useRef } from 'react'
import { CSVLink } from 'react-csv'

import styled from 'styled-components'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'

import { IconTrayDownload } from '../../assets/dashboardOnlyIcons'
import { formatProjectDataHelper } from '../../helperFunctions'

import { ButtonSecondary } from '../generic'

const ButtonSecondaryWithMargin = styled(ButtonSecondary)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0 2rem;
  margin-left: 1rem;
`

const StyledCSVLink = styled(CSVLink)`
  display: none;
`

const TableControls = () => {
  const csvLinkRef = useRef()

  const { displayedProjects } = useContext(FilterProjectsContext)

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

  return (
    <>
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
    </>
  )
}

export default TableControls
