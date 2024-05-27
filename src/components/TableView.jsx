import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table, Tr, Th } from './generic/table'
import theme from '../theme'
import { useAuth0 } from '@auth0/auth0-react'
import { IconPersonCircle } from './icons'
import { formatProjectDataHelper } from '../utils/formatProjectDataHelper'

const StyledTableContainer = styled('div')`
  height: calc(100vh - 50px);
  margin-right: 31.5rem;
  flex-grow: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
`

const Thead = styled.th`
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 2rem;
  font-weight: normal;
  border: 1px solid black;
`

const ThNumeric = styled(Th)`
  text-align: right;
`

export default function TableView(props) {
  const { displayedProjects, tableHeaders } = props
  const { user } = useAuth0()

  const handleProjectRowClick = (project) => {
    console.log('TODO Update metrics pane to show this project: ', project)
  }

  const renderTableBody = () => {
    return displayedProjects.map((project) => {
      const { projectName, formattedYears, countries, organizations, siteCount } =
        formatProjectDataHelper(project)
      const userIsProjectAdmin = project.records.some((record) =>
        record.project_admins.some((admin) => admin?.name === user?.name),
      )
      return (
        <Tr key={project.project_id} onClick={() => handleProjectRowClick(project)}>
          <Th>
            {projectName} {userIsProjectAdmin && <IconPersonCircle />}
          </Th>
          <Th>{formattedYears}</Th>
          <Th>{countries}</Th>
          <Th>{organizations || '-'}</Th>
          <ThNumeric>{project.records.length}</ThNumeric>
          <ThNumeric>{siteCount}</ThNumeric>
        </Tr>
      )
    })
  }

  return (
    <StyledTableContainer>
      <Table>
        <thead>
          <Tr>
            {tableHeaders.map((header) => (
              <Thead key={header}>{header}</Thead>
            ))}
          </Tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </Table>
    </StyledTableContainer>
  )
}

TableView.propTypes = {
  displayedProjects: PropTypes.array.isRequired,
  tableHeaders: PropTypes.array.isRequired,
}
