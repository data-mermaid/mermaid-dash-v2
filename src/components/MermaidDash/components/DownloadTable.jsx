import { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'

import styled, { css } from 'styled-components'
import theme from '../../../styles/theme'

import { Tr, Th, Td, reactTableNaturalSort } from '../../generic'
import { ModalStickyTable, ModalTableOverflowWrapper } from '../../generic/table'
import { IconUserCircle } from '../../../assets/dashboardOnlyIcons'
import { IconCheck, IconClose, IconContact } from '../../../assets/icons'
import { getTableColumnHeaderProps } from '../../../helperFunctions'

const StyledTr = styled(Tr)`
  & > td:first-of-type {
    overflow-wrap: break-word;
  }
  ${({ $isExcluded }) =>
    $isExcluded
      ? css`
          background-color: ${theme.color.backgroundColor} !important;
        `
      : undefined}
`

const DownloadTableView = ({ tableData }) => {
  const tableColumns = useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Surveys',
        accessor: 'surveyCount',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
      {
        Header: 'Data sharing',
        accessor: 'dataSharingPolicy',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
      {
        Header: 'Metadata',
        accessor: 'metaData',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
      {
        Header: 'Survey Data',
        accessor: 'surveyData',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
      {
        Header: 'Observation Data',
        accessor: 'observationData',
        sortType: reactTableNaturalSort,
        align: 'right',
      },
    ],
    [],
  )

  const tableCellData = useMemo(() => {
    return tableData.map((data) => {
      const {
        projectId,
        projectName,
        surveyCount,
        dataSharingPolicy,
        metaData,
        surveyData,
        observationData,
        isMemberOfProject,
        rawProjectData,
      } = data

      const result = {
        projectId,
        projectName,
        surveyCount,
        dataSharingPolicy,
        metaData,
        surveyData,
        observationData,
        isMemberOfProject,
        rawProjectData,
      }

      return result
    })
  }, [tableData])

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      autoResetSortBy: false,
    },
    useSortBy,
  )

  return (
    <>
      <ModalTableOverflowWrapper>
        <ModalStickyTable {...getTableProps()}>
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
            {rows.map((row) => {
              prepareRow(row)
              const rowProps = row.getRowProps()
              const { key, ...restRowProps } = rowProps
              const { projectId, metaData, surveyData, observationData, isMemberOfProject } =
                row.original
              const isExcluded = !metaData && !surveyData && !observationData

              return (
                <StyledTr key={key} {...restRowProps} $isExcluded={isExcluded}>
                  {row.cells.map((cell) => {
                    const cellProps = cell.getCellProps()
                    const { key: cellKey, ...restCellProps } = cellProps

                    let cellContent = cell.render('Cell')

                    if (['metaData', 'surveyData', 'observationData'].includes(cell.column.id)) {
                      cellContent = cell.value ? (
                        <IconCheck style={{ color: 'green' }} />
                      ) : (
                        <IconClose style={{ color: 'red' }} />
                      )
                    }

                    return (
                      <Td key={cellKey} {...restCellProps} align={cell.column.align}>
                        {cellContent}
                        {cell.column.Header === 'Project Name' &&
                          (isMemberOfProject ? (
                            <IconUserCircle style={{ marginLeft: '5px' }} />
                          ) : (
                            <a
                              href={`https://datamermaid.org/contact-project?project_id=${projectId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconContact style={{ marginLeft: '5px' }} />
                            </a>
                          ))}
                      </Td>
                    )
                  })}
                </StyledTr>
              )
            })}
          </tbody>
        </ModalStickyTable>
      </ModalTableOverflowWrapper>
    </>
  )
}

export default DownloadTableView
