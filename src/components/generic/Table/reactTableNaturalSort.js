const reactTableNaturalSort = (rowA, rowB, columnId) => {
  const rowACellContents = rowA?.original[columnId] ?? ''
  const rowBCellContents = rowB?.original[columnId] ?? ''

  return rowACellContents.toString().localeCompare(rowBCellContents, 'en', {
    numeric: true,
    caseFirst: 'upper',
  })
}

const ReactTableCustomYearSort = (rowA, rowB, columnId, desc) => {
  const getYear = (yearStr) => {
    const yearRange = yearStr.split('-')
    if (yearRange.length === 2) {
      return desc ? parseInt(yearRange[0], 10) : parseInt(yearRange[1], 10)
    }
    return parseInt(yearStr, 10)
  }

  const yearA = getYear(rowA.values[columnId])
  const yearB = getYear(rowB.values[columnId])

  if (yearA === yearB) {
    return 0
  }
  return yearA > yearB ? 1 : -1
}

export { reactTableNaturalSort, ReactTableCustomYearSort }
