import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import styled from 'styled-components'
import ContentPageLayout from './components/ContentPageLayout'
import { getTableColumnHeaderProps, formatProjectDataHelper } from '../../helperFunctions'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  StickyTableOverflowWrapper,
  GenericStickyTable,
  reactTableNaturalSort,
  ReactTableCustomDateRangeSort,
  PageSelector,
  PageSizeSelector,
  EmptySpace,
} from '../generic'
import { PAGE_SIZE_DEFAULT } from '../../constants/constants'
import { useLocation, useNavigate } from 'react-router-dom'
import MapAndTableControls from '../MapAndTableControls/MapAndTableControls'
import { useFilterProjectsContext } from '../../context/FilterProjectsContext'
import { IconUserCircle } from '../../assets/dashboardOnlyIcons'

const StyledTableContainer = styled.div`
  height: calc(100vh - 50px);
  flex-grow: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TableView = ({ view, setView, mermaidUserData }) => {
  const {
    displayedProjects,
    userIsMemberOfProject,
    checkedProjects,
    setShowProjectsWithNoRecords,
  } = useFilterProjectsContext()
  const [tableData, setTableData] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const getURLParams = () => new URLSearchParams(location.search)
  const queryParams = getURLParams()
  const queryParamsProjectId = queryParams.get('project_id')

  const _onUnmount = useEffect(() => {
    return () => {
      setShowProjectsWithNoRecords(false)
    }
  }, [setShowProjectsWithNoRecords])

  const _getSiteRecords = useEffect(() => {
    const formattedTableData = displayedProjects
      .map((project, i) => {
        if (!checkedProjects.includes(project.project_id)) {
          return null
        }
        const { projectName, formattedDateRange, countries, organizations, surveyCount, transects } =
          formatProjectDataHelper(project)
        return {
          id: i,
          projectName,
          formattedDateRange,
          countries,
          organizations,
          transects,
          surveyCount,
          rawProjectData: project,
        }
      })
      .filter((project) => project !== null)
    setTableData(formattedTableData)
  }, [displayedProjects, checkedProjects])

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Date Range',
        accessor: 'formattedDateRange',
        sortType: (rowA, rowB, columnId, desc) =>
          ReactTableCustomDateRangeSort(rowA, rowB, columnId, desc),
      },
      {
        Header: 'Countries',
        accessor: 'countries',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Organizations',
        accessor: 'organizations',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Surveys',
        accessor: 'surveyCount',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
      {
        Header: 'Transects',
        accessor: 'transects',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
    ],
    [],
  )

  const tableCellData = useMemo(() => {
    return tableData.map((data) => {
      const {
        projectName,
        formattedDateRange,
        countries,
        organizations,
        surveyCount,
        transects,
        rawProjectData,
      } = data

      return {
        projectName,
        formattedDateRange,
        countries,
        organizations,
        surveyCount,
        transects,
        rawProjectData,
      }
    })
  }, [tableData])

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    prepareRow,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: {
        pageSize: PAGE_SIZE_DEFAULT,
      },
    },
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  const updateURLParams = (queryParams) => {
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
  }

  const handleTableRowClick = (projectData) => {
    console.log('TODO: display project data in metrics pane', projectData)
    queryParams.delete('sample_event_id')
    if (queryParamsProjectId !== projectData.project_id) {
      queryParams.set('project_id', projectData.project_id)
    } else {
      queryParams.delete('project_id')
    }
    updateURLParams(queryParams)
  }

  const _displaySelectedProjectInMetricsPane = useEffect(() => {
    if (queryParamsProjectId) {
      const selectedProject = displayedProjects.find(
        (project) => project.project_id === queryParamsProjectId,
      )
      console.log('TODO: display the initially selected project in metrics pane', selectedProject)
    }
  }, [displayedProjects, queryParamsProjectId])

  const table = tableData.length ? (
    <>
      <EmptySpace />
      <StickyTableOverflowWrapper>
        <GenericStickyTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps()
              const { key: headerGroupKey, ...restHeaderGroupProps } = headerGroupProps

              return (
                <Tr key={headerGroupKey} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const columnProps = column.getHeaderProps({
                      ...getTableColumnHeaderProps(column),
                      ...{ style: { textAlign: column.align } },
                    })
                    const { key: columnKey, ...restColumnProps } = columnProps

                    return (
                      <Th key={columnKey} {...restColumnProps}>
                        <span>
                          {column.render('Header')}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <span> &#9660;</span>
                            ) : (
                              <span> &#9650;</span>
                            )
                          ) : (
                            ''
                          )}
                        </span>
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              const rowProps = row.getRowProps()
              const { key: rowKey, ...restRowProps } = rowProps

              return (
                <Tr key={rowKey} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const cellProps = cell.getCellProps()
                    const { key: cellKey, ...restCellProps } = cellProps

                    return (
                      <Td
                        key={cellKey}
                        {...restCellProps}
                        align={cell.column.align}
                        onClick={() => handleTableRowClick(cell.row.original.rawProjectData)}
                      >
                        {cell.render('Cell')}{' '}
                        {cell.column.Header === 'Project Name' &&
                        userIsMemberOfProject(
                          cell.row.original.rawProjectData.project_id,
                          mermaidUserData,
                        ) ? (
                          <IconUserCircle />
                        ) : (
                          ''
                        )}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </GenericStickyTable>
      </StickyTableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[15, 50, 100]}
          pageType="site"
          unfilteredRowLength={tableData.length}
        />
        <PageSelector
          onPreviousClick={previousPage}
          previousDisabled={!canPreviousPage}
          onNextClick={nextPage}
          nextDisabled={!canNextPage}
          onGoToPage={gotoPage}
          currentPageIndex={pageIndex}
          pageCount={pageOptions.length}
        />
      </TableNavigation>
    </>
  ) : (
    <>
      <EmptySpace />
      <div>No project data</div>
    </>
  )

  return (
    <StyledTableContainer>
      <ContentPageLayout content={table} />
      <MapAndTableControls view={view} setView={setView} />
    </StyledTableContainer>
  )
}

export default TableView

TableView.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  mermaidUserData: PropTypes.object,
}
