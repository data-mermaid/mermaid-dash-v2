import styled from 'styled-components'
import PropTypes from 'prop-types'

import theme from '../../styles/theme'
import dashboardOnlyTheme from '../../styles/dashboardOnlyTheme'

import { IconButton } from '.'
import { IconClose } from '../../assets/icons'

const FilterIndictorPillContainer = styled.div`
  color: ${theme.color.textColor};
  padding: ${theme.spacing.xxsmall} ${theme.spacing.medium};
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${dashboardOnlyTheme.color.yellow};
  font-size: ${theme.typography.defaultFontSize};
  border: solid 1px ${theme.color.border};
  border-radius: 5px;
`

const FilterAmount = styled.span`
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
      Filtered
      <FilterAmount>
        {searchFilteredRowLength} / {unfilteredRowLength}
      </FilterAmount>
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
