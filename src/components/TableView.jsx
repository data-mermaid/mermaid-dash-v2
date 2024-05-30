import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import styled from 'styled-components'
import ContentPageLayout from './Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { getTableColumnHeaderProps } from '../library/getTableColumnHeaderProps'
import { H2 } from './generic/text'
import PageSelector from './generic/Table/PageSelector/PageSelector'
import PageSizeSelector from './generic/Table/PageSizeSelector/PageSizeSelector'

import {
  reactTableNaturalSort,
  ReactTableCustomYearSort,
} from './generic/Table/reactTableNaturalSort'
import {
  Tr,
  Th,
  Td,
  TableNavigation,
  StickyTableOverflowWrapper,
  GenericStickyTable,
} from './generic/table'
import { PAGE_SIZE_DEFAULT } from '../library/constants/constants'
import { formatProjectDataHelper } from '../utils'

const StyledTableContainer = styled('div')`
  height: calc(100vh - 50px);
  margin-right: 31.5rem;
  flex-grow: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
`

const TableView = (props) => {
  const { displayedProjects } = props
  const [isLoading, setIsLoading] = useState(true)
  const [tableData, setTableData] = useState([])

  const _getSiteRecords = useEffect(() => {
    const formattedTableData = displayedProjects.map((project, i) => {
      const { projectName, formattedYears, countries, organizations, siteCount } =
        formatProjectDataHelper(project)
      return {
        id: i,
        projectName,
        formattedYears,
        countries,
        organizations,
        transects: project.records.length,
        siteCount,
        rawProjectData: project,
      }
    })

    setTableData(formattedTableData)
    setIsLoading(false)
  }, [displayedProjects])

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Years',
        accessor: 'formattedYears',
        sortType: (rowA, rowB, columnId, desc) =>
          ReactTableCustomYearSort(rowA, rowB, columnId, desc),
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
        Header: 'Transects',
        accessor: 'transects',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
      {
        Header: 'Sites',
        accessor: 'siteCount',
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
        formattedYears,
        countries,
        organizations,
        transects,
        siteCount,
        rawProjectData,
      } = data

      return {
        projectName,
        formattedYears,
        countries,
        organizations,
        transects,
        siteCount,
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

  const table = tableData.length ? (
    <>
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
                        <span>{column.render('Header')}</span>
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
                        onClick={() =>
                          console.log(
                            'TODO: display project data in metrics pane: ',
                            cell.row.original.rawProjectData,
                          )
                        }
                      >
                        {cell.render('Cell')}
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
    <div>No project data</div>
  )

  return (
    <StyledTableContainer>
      <ContentPageLayout
        toolbar={
          <>
            <H2>Projects</H2>
          </>
        }
        content={table}
        isPageContentLoading={isLoading}
      />
    </StyledTableContainer>
  )
}

export default TableView

TableView.propTypes = {
  displayedProjects: PropTypes.array.isRequired,
}
