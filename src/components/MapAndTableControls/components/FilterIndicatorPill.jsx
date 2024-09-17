import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../../../styles/theme'
import dashboardOnlyTheme from '../../../styles/dashboardOnlyTheme'

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
`

const FilterAmount = styled.span`
  font-weight: bold;
  padding: 0 0.4em;
`

const FilterIndicatorPill = ({ searchFilteredRowLength = null, unfilteredRowLength }) => {
  return (
    <FilterIndictorPillContainer>
      <FilterAmount>
        {searchFilteredRowLength} / {unfilteredRowLength}
      </FilterAmount>
      Filtered
    </FilterIndictorPillContainer>
  )
}

FilterIndicatorPill.propTypes = {
  searchFilteredRowLength: PropTypes.number,
  unfilteredRowLength: PropTypes.number.isRequired,
}

export default FilterIndicatorPill
