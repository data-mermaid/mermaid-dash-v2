import { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import styled, { css } from 'styled-components'
import theme from '../../../styles/theme'

import { Tr, Th, Td, reactTableNaturalSort, IconButton } from '../../generic'
import { ModalStickyTable, ModalTableOverflowWrapper } from '../../generic/table'
import { IconUserCircle } from '../../../assets/dashboardOnlyIcons'
import { IconCheck, IconClose, IconContact } from '../../../assets/icons'
import { getTableColumnHeaderProps } from '../../../helperFunctions'
import { ResponsiveTooltip } from '../../generic/ResponsiveTooltip'

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

const ExportTableView = ({ exportTableData }) => {
  const { t } = useTranslation()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
        width: 360,
      },
      {
        Header: 'Transects',
        accessor: 'transectCount',
        sortType: reactTableNaturalSort,
        align: 'right',
        width: 110,
      },
      {
        Header: 'Data Sharing',
        accessor: 'dataSharingPolicy',
        sortType: reactTableNaturalSort,
        align: 'left',
        width: 150,
      },
      {
        Header: 'Summary Data',
        accessor: 'summaryData',
        sortType: reactTableNaturalSort,
        align: 'center',
        width: 150,
      },
      {
        Header: 'Observation Data',
        accessor: 'observationData',
        sortType: reactTableNaturalSort,
        align: 'center',
        width: 180,
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      exportTableData.map(
        ({
          projectId,
          projectName,
          transectCount,
          dataSharingPolicy,
          summaryData,
          observationData,
          isMemberOfProject,
          rawProjectData,
        }) => ({
          projectId,
          projectName,
          transectCount,
          dataSharingPolicy,
          summaryData,
          observationData,
          isMemberOfProject,
          rawProjectData,
        }),
      ),
    [exportTableData],
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
          {rows.length > 0 ? (
            rows.map((row) => {
              prepareRow(row)
              const { key, ...restRowProps } = row.getRowProps()
              const { projectId, isMemberOfProject } = row.original

              return (
                <StyledTr key={key} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...restCellProps } = cell.getCellProps()
                    let view = cell.render('Cell')

                    if (['summaryData', 'observationData'].includes(cell.column.id)) {
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
                        {cell.column.Header === 'Project Name' &&
                          (isMemberOfProject ? (
                            <ResponsiveTooltip
                              title={t('your_projects')}
                              placement="top"
                              bgColor={theme.color.primaryColor}
                              tooltipTextColor={theme.color.white}
                            >
                              <IconButton>
                                <IconUserCircle />
                              </IconButton>
                            </ResponsiveTooltip>
                          ) : (
                            <ResponsiveTooltip
                              title={t('contact_admins')}
                              placement="top"
                              bgColor={theme.color.primaryColor}
                              tooltipTextColor={theme.color.white}
                            >
                              <a
                                href={`https://datamermaid.org/contact-project?project_id=${projectId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <IconContact />
                              </a>
                            </ResponsiveTooltip>
                          ))}
                      </Td>
                    )
                  })}
                </StyledTr>
              )
            })
          ) : (
            <StyledTr>
              <Td colSpan={tableColumns.length} align="center">
                No data available
              </Td>
            </StyledTr>
          )}
        </tbody>
      </ModalStickyTable>
    </ModalTableOverflowWrapper>
  )
}

ExportTableView.propTypes = {
  exportTableData: PropTypes.array.isRequired,
}

export default ExportTableView
