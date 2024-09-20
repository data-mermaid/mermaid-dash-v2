import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../../styles/theme'
import { mediaQueryTabletLandscapeOnly } from '../../../styles/mediaQueries'

const StyledLoadingContainer = styled.div`
  position: absolute;
  width: '20rem';
  bottom: 1.5rem;
  left: 1.5rem;
  padding: 0.8rem 1rem;
  z-index: 400;
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    left: auto;
    display: flex;
    flex-direction: row;
    width: 90vw;
    justify-content: center;
    background-color: ${theme.color.white};
    justify-self: center;
    bottom: 0.5rem;
    justify-self: center;
  `)}
`

const StyledProgressBarContainer = styled.div`
  width: 100%;
  background-color: ${theme.color.grey2};
  height: 1rem;
  border-radius: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  ${mediaQueryTabletLandscapeOnly(css`
    width: 15rem;
  `)}
`

const StyledProgressBar = styled.div`
  width: ${(props) => props.$value}%;
  background-color: ${theme.color.primaryColor};
  height: 100%;
`

const StyledHeader = styled.header`
  ${mediaQueryTabletLandscapeOnly(css`
    width: 15rem;
  `)}
`

const LoadingIndicator = ({
  currentProgress,
  finalProgress,
  isLoadingIndicatorPreventedFromShowing,
}) => {
  const [loadingProgressValue, setLoadingProgressValue] = useState(0)
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(
    !isLoadingIndicatorPreventedFromShowing,
  )

  const _calculateCurrentLoadingPercentage = useEffect(() => {
    if (finalProgress === 0) {
      return // we cant divide by zero
    }
    setLoadingProgressValue(Math.floor((currentProgress / finalProgress) * 100))
  }, [currentProgress, finalProgress])

  const _hideLoadingBarAfterTimeout = useEffect(() => {
    if (loadingProgressValue === 100) {
      setTimeout(() => {
        setShowLoadingIndicator(false)
      }, 10000)
    }
  }, [loadingProgressValue, setShowLoadingIndicator])

  return showLoadingIndicator === true ? (
    <StyledLoadingContainer>
      <StyledHeader>
        {loadingProgressValue === 100
          ? `Done ${loadingProgressValue}%`
          : `Loading ${loadingProgressValue}%`}
      </StyledHeader>
      <StyledProgressBarContainer>
        <StyledProgressBar $value={loadingProgressValue} />
      </StyledProgressBarContainer>
    </StyledLoadingContainer>
  ) : null
}

LoadingIndicator.propTypes = {
  currentProgress: PropTypes.number.isRequired,
  finalProgress: PropTypes.number.isRequired,
  isLoadingIndicatorPreventedFromShowing: PropTypes.bool,
}

export default LoadingIndicator
