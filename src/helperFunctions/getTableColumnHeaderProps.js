import { table } from '../constants/language'

export const getTableColumnHeaderProps = (column) => {
  let sortByTitle = table.sortAscendingTitle

  if (column.isSortedDesc === true) {
    sortByTitle = table.sortRemoveTitle
  } else if (column.isSortedDesc === false) {
    sortByTitle = table.sortDescendingTitle
  }

  return column.getSortByToggleProps({ title: sortByTitle })
}
