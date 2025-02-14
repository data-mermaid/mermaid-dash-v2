import { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import PropTypes from 'prop-types'

import styled, { css } from 'styled-components'
import theme from '../../../styles/theme'

import { Tr, Th, Td, reactTableNaturalSort, IconButton } from '../../generic'
import { ModalStickyTable, ModalTableOverflowWrapper } from '../../generic/table'
import { IconUserCircle } from '../../../assets/dashboardOnlyIcons'
import { IconCheck, IconClose } from '../../../assets/icons'
import { getTableColumnHeaderProps } from '../../../helperFunctions'
import { MuiTooltip } from '../../generic/MuiTooltip'
import { tooltipText } from '../../../constants/language'

const StyledTr = styled(Tr)`
  & > td:first-of-type {
    overflow-wrap: break-word;
  }
  ${({ $isExcluded }) =>
    $isExcluded &&
    css`
      background-color: ${theme.color.backgroundColor} !important;
    `}
`

const DownloadGFCRTableView = ({ tableData }) => {
  const tableColumns = useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'GFCR Indicators',
        accessor: 'projectIncludeGFCR',
        sortType: reactTableNaturalSort,
        align: 'center',
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      tableData.map(
        ({ projectId, projectName, projectIncludeGFCR, isMemberOfProject, rawProjectData }) => ({
          projectId,
          projectName,
          projectIncludeGFCR,
          isMemberOfProject,
          rawProjectData,
        }),
      ),
    [tableData],
  )

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      autoResetSortBy: false,
    },
    useSortBy,
  )

  return (
    <ModalTableOverflowWrapper>
      <ModalStickyTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps()

            return (
              <Tr key={headerGroupKey} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const columnProps = column.getHeaderProps({
                    ...getTableColumnHeaderProps(column),
                    style: { textAlign: column.align, width: column.width },
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
            const { key, ...restRowProps } = row.getRowProps()
            const { isMemberOfProject } = row.original

            return (
              <StyledTr key={key} {...restRowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...restCellProps } = cell.getCellProps()
                  let view = cell.render('Cell')

                  if (cell.column.id === 'projectIncludeGFCR') {
                    view = cell.value ? (
                      <IconCheck style={{ color: 'green' }} />
                    ) : (
                      <IconClose style={{ color: 'red' }} />
                    )
                  }

                  return (
                    <Td
                      key={cellKey}
                      {...restCellProps}
                      align={cell.column.align}
                      textTransform={'capitalize'}
                      style={{ width: cell.column.width }}
                    >
                      {view}{' '}
                      {cell.column.Header === 'Project Name' && isMemberOfProject ? (
                        <MuiTooltip
                          title={tooltipText.yourProject}
                          placement="top"
                          bgColor={theme.color.primaryColor}
                          tooltipTextColor={theme.color.white}
                        >
                          <IconButton>
                            <IconUserCircle />
                          </IconButton>
                        </MuiTooltip>
                      ) : null}
                    </Td>
                  )
                })}
              </StyledTr>
            )
          })}
        </tbody>
      </ModalStickyTable>
    </ModalTableOverflowWrapper>
  )
}

DownloadGFCRTableView.propTypes = {
  tableData: PropTypes.array.isRequired,
}

export default DownloadGFCRTableView
