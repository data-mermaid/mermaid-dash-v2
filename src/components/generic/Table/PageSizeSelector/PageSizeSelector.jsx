import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import { Select } from '../../form'
import { Select } from '../../form'

const PageSizeSelect = styled(Select)`
  width: auto;
  min-width: auto;
  margin-right: 0.3em;
`

const PageSizeSelector = ({
  pageSize,
  pageType,
  pageSizeOptions,
  onChange,
  unfilteredRowLength,
  methodFilteredRowLength = null,
  searchFilteredRowLength = null,
  isMethodFilterEnabled = false,
  isSearchFilterEnabled = false,
}) => {
  const [pageOptionsToDisplay, setPageOptionsToDisplay] = useState([])
  const [filteredAmountToDisplay, setFilteredAmountToDisplay] = useState(null)

  const _findFilteredAmountToDisplay = useEffect(() => {
    // the search results will be method filtered already, which is not the case the opposite way around
    if (isSearchFilterEnabled) {
      setFilteredAmountToDisplay(searchFilteredRowLength)
    } else if (isMethodFilterEnabled) {
      setFilteredAmountToDisplay(methodFilteredRowLength)
    } else {
      setFilteredAmountToDisplay(unfilteredRowLength)
    }

    return setFilteredAmountToDisplay(unfilteredRowLength)
  }, [
    isMethodFilterEnabled,
    isSearchFilterEnabled,
    methodFilteredRowLength,
    searchFilteredRowLength,
    unfilteredRowLength,
  ])

  const _findPageOptionsToDisplay = useEffect(() => {
    let pageOptions = pageSizeOptions.filter((option) => option < filteredAmountToDisplay)

    if (pageOptions.length === 0 || pageOptions[pageOptions.length - 1] < filteredAmountToDisplay) {
      pageOptions.push(filteredAmountToDisplay)
    }

    setPageOptionsToDisplay(pageOptions)
  }, [pageSizeOptions, filteredAmountToDisplay])

  return (
    <label htmlFor="page-size-selector">
      Showing{' '}
      <PageSizeSelect
        value={pageSize}
        onChange={onChange}
        id="page-size-selector"
        data-testid="page-size-selector"
      >
        {pageOptionsToDisplay.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </PageSizeSelect>
      of {filteredAmountToDisplay}
      {isSearchFilterEnabled || isMethodFilterEnabled
        ? `${' '}(filtered from ${unfilteredRowLength}${' '}${pageType}${
            unfilteredRowLength > 1 ? 's' : ''
          })`
        : null}
    </label>
  )
}

PageSizeSelector.propTypes = {
  unfilteredRowLength: PropTypes.number.isRequired,
  methodFilteredRowLength: PropTypes.number,
  searchFilteredRowLength: PropTypes.number,
  isMethodFilterEnabled: PropTypes.bool,
  isSearchFilterEnabled: PropTypes.bool,
  pageType: PropTypes.string.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PageSizeSelector
