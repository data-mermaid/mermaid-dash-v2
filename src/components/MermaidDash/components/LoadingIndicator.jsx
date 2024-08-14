import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../../styles/theme'
import { mediaQueryTabletLandscapeOnly } from '../../../styles/mediaQueries'

const StyledLoadingContainer = styled('div')`
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

const StyledProgressBarContainer = styled('div')`
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

const StyledProgressBar = styled('div')`
  width: ${(props) => props.$value}%;
  background-color: ${theme.color.primaryColor};
  height: 100%;
  transition: width 0.3s ease-in-out;
`

const StyledHeader = styled('header')`
  ${mediaQueryTabletLandscapeOnly(css`
    width: 15rem;
  `)}
`

const LoadingIndicator = ({ projectData, showLoadingIndicator, setShowLoadingIndicator }) => {
  const [loadingProgressValue, setLoadingProgressValue] = useState(0)

  const _calculateCurrentLoadingPercentage = useEffect(() => {
    if (!projectData.count || !projectData.results) {
      return
    }
    setLoadingProgressValue(Math.floor((projectData.results.length / projectData.count) * 100))
  }, [projectData])

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
  projectData: PropTypes.shape({
    count: PropTypes.number,
    results: PropTypes.array,
  }).isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
  setShowLoadingIndicator: PropTypes.func.isRequired,
}

export default LoadingIndicator
