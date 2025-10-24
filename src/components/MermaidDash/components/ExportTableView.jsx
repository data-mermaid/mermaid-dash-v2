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
import { MuiTooltip } from '../../generic/MuiTooltip'

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
  const projectNameHeaderText = t('project_name')
  const surveyCountHeaderText = t('surveys')
  const dataSharingHeaderText = t('data_sharing')
  const summaryDataHeaderText = t('summary_data')
  const observationDataHeaderText = t('observation_data')

  const tableColumns = useMemo(
    () => [
      {
        Header: projectNameHeaderText,
        accessor: 'projectName',
        sortType: reactTableNaturalSort,
        width: 360,
      },
      {
        Header: surveyCountHeaderText,
        accessor: 'surveyCount',
        sortType: reactTableNaturalSort,
        align: 'right',
        width: 110,
      },
      {
        Header: dataSharingHeaderText,
        accessor: 'dataSharingPolicy',
        sortType: reactTableNaturalSort,
        align: 'left',
        width: 150,
      },
      {
        Header: summaryDataHeaderText,
        accessor: 'summaryData',
        sortType: reactTableNaturalSort,
        align: 'center',
        width: 150,
      },
      {
        Header: observationDataHeaderText,
        accessor: 'observationData',
        sortType: reactTableNaturalSort,
        align: 'center',
        width: 180,
      },
    ],
    [
      projectNameHeaderText,
      surveyCountHeaderText,
      dataSharingHeaderText,
      summaryDataHeaderText,
      observationDataHeaderText,
    ],
  )

  const tableCellData = useMemo(
    () =>
      exportTableData.map(
        ({
          projectId,
          projectName,
          surveyCount,
          dataSharingPolicy,
          summaryData,
          observationData,
          isMemberOfProject,
          rawProjectData,
        }) => ({
          projectId,
          projectName,
          surveyCount,
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
          {rows.length > 0 &&
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
                            <MuiTooltip
                              title={t('your_projects')}
                              placement="top"
                              bgColor={`${theme.color.primaryColor}`}
                              tooltipTextColor={`${theme.color.white}`}
                            >
                              <IconButton>
                                <IconUserCircle />
                              </IconButton>
                            </MuiTooltip>
                          ) : (
                            <MuiTooltip
                              title={t('contact_admins')}
                              placement="top"
                              bgColor={`${theme.color.primaryColor}`}
                              tooltipTextColor={`${theme.color.white}`}
                            >
                              <a
                                href={`https://datamermaid.org/contact-project?project_id=${projectId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <IconContact />
                              </a>
                            </MuiTooltip>
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
  )
}

ExportTableView.propTypes = {
  exportTableData: PropTypes.array.isRequired,
}

export default ExportTableView
