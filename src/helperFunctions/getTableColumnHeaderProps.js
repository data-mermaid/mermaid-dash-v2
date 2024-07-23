// import { language } from './language
import language from '../constants/language'

export const getTableColumnHeaderProps = (column) => {
  let sortByTitle = language.table.sortAscendingTitle

  if (column.isSortedDesc === true) {
    sortByTitle = language.table.sortRemoveTitle
  } else if (column.isSortedDesc === false) {
    sortByTitle = language.table.sortDescendingTitle
  }

  return column.getSortByToggleProps({ title: sortByTitle })
}
