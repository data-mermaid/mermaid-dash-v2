import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePagination, useSortBy, useTable } from 'react-table'
import PropTypes from 'prop-types'

import styled, { css } from 'styled-components'
import { FilterProjectsContext } from '../../context/FilterProjectsContext'

import theme from '../../styles/theme'
import { PAGE_SIZE_DEFAULT } from '../../constants/constants'
import { noDataText } from '../../constants/language'
import { IconUserCircle } from '../../assets/dashboardOnlyIcons'
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

import ContentPageLayout from './components/ContentPageLayout'
import MapAndTableControls from '../MapAndTableControls/MapAndTableControls'

const StyledTableContainer = styled.div`
  height: calc(100vh - 55px);
  flex-grow: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledTr = styled(Tr)`
  & > td:first-of-type {
    overflow-wrap: break-word;
  }
  ${({ $isSelected }) =>
    $isSelected
      ? css`
          background-color: ${theme.color.backgroundColor} !important;
        `
      : undefined}
`

const TableView = ({ view, setView, mermaidUserData }) => {
  const { displayedProjects, userIsMemberOfProject, setSelectedProject } =
    useContext(FilterProjectsContext)
  const [tableData, setTableData] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const getURLParams = () => new URLSearchParams(location.search)
  const queryParams = getURLParams()
  const queryParamsProjectId = queryParams.get('project_id')
  const initialPageIndex = Number(queryParams.get('page_index')) || 0

  const _getSiteRecords = useEffect(() => {
    const formattedTableData = displayedProjects
      .map((project, i) => {
        const {
          projectName,
          formattedDateRange,
          countries,
          organizations,
          surveyCount,
          transects,
        } = formatProjectDataHelper(project)
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
  }, [displayedProjects])

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
        pageIndex: initialPageIndex,
      },
      autoResetSortBy: false,
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
    queryParams.delete('sample_event_id')
    if (queryParamsProjectId !== projectData.project_id) {
      queryParams.set('project_id', projectData.project_id)
      setSelectedProject(projectData)
    } else {
      queryParams.delete('project_id')
      setSelectedProject(null)
    }
    queryParams.set('page_index', pageIndex)
    updateURLParams(queryParams)
  }

  const handleGoToPage = (page) => {
    queryParams.set('page_index', page)
    updateURLParams(queryParams)
    gotoPage(page)
  }

  const handleNextPage = () => {
    if (canNextPage) {
      queryParams.set('page_index', pageIndex + 1)
      updateURLParams(queryParams)
      nextPage()
    }
  }

  const handlePreviousPage = () => {
    if (canPreviousPage) {
      queryParams.set('page_index', pageIndex - 1)
      updateURLParams(queryParams)
      previousPage()
    }
  }

  const _displaySelectedProjectInMetricsPane = useEffect(() => {
    if (queryParamsProjectId) {
      const selectedProject = displayedProjects.find(
        ({ project_id }) => project_id === queryParamsProjectId,
      )
      setSelectedProject(selectedProject)
    }
  }, [displayedProjects, queryParamsProjectId, setSelectedProject])

  const _updatePageIndex = useEffect(() => {
    const newPageIndex = Number(queryParams.get('page_index'))
    if (!isNaN(newPageIndex) && newPageIndex !== pageIndex) {
      gotoPage(newPageIndex)
    }
  }, [queryParams, gotoPage, pageIndex])

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
              const isRowSelected =
                row?.original?.rawProjectData?.project_id === queryParamsProjectId

              return (
                <StyledTr key={rowKey} $isSelected={isRowSelected} {...restRowProps}>
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
                </StyledTr>
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
          onPreviousClick={handlePreviousPage}
          previousDisabled={!canPreviousPage}
          onNextClick={handleNextPage}
          nextDisabled={!canNextPage}
          onGoToPage={handleGoToPage}
          currentPageIndex={pageIndex}
          pageCount={pageOptions.length}
        />
      </TableNavigation>
    </>
  ) : (
    <>
      <EmptySpace />
      <div>{noDataText.noTableData}</div>
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
