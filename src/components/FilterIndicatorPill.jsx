import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { IconClose } from './icons'
import theme from '../theme'
import { IconButton } from './generic/buttons'
import dashboardOnlyTheme from './dashboardOnlyTheme'

const FilterIndictorPillContainer = styled.div`
  border: solid 1px ${theme.color.border};
  color: ${theme.color.textColor};
  padding: ${theme.spacing.xxsmall} ${theme.spacing.medium};
  border-radius: 5px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${dashboardOnlyTheme.color.yellow};
  font-size: ${theme.typography.defaultFontSize};
`

const FilterAmount = styled.p`
  font-weight: bold;
  padding: 0 0.4em;
`

const FilterIndicatorPill = ({
  searchFilteredRowLength = null,
  unfilteredRowLength,
  clearFilters,
}) => {
  return (
    <FilterIndictorPillContainer>
      Filtered{' '}
      <FilterAmount>
        {searchFilteredRowLength} / {unfilteredRowLength}
      </FilterAmount>{' '}
      <IconButton type="button" onClick={clearFilters}>
        <IconClose />
      </IconButton>
    </FilterIndictorPillContainer>
  )
}

FilterIndicatorPill.propTypes = {
  searchFilteredRowLength: PropTypes.number,
  unfilteredRowLength: PropTypes.number.isRequired,
  clearFilters: PropTypes.func.isRequired,
}

export default FilterIndicatorPill
