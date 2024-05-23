import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../theme'
import { mediaQueryTabletLandscapeOnly } from '../styles/mediaQueries'

const StyledLoadingContainer = styled('div')`
  position: absolute;
  width: ${(props) => (props.showLoadingBar ? '20rem' : '14rem')};
  right: 33rem;
  top: 8rem;
  padding: 0.8rem 1rem;
  z-index: 2;
  background-color: ${theme.color.grey1};
  ${mediaQueryTabletLandscapeOnly(css`
    right: 3rem;
  `)}
`

const StyledProgressBarContainer = styled('div')`
  width: 100%;
  background-color: ${theme.color.grey2};
  height: 1rem;
  border-radius: 0;
  margin: 0.5rem 0;
  overflow: hidden;
`

const StyledProgressBar = styled('div')`
  width: ${(props) => props.value}%;
  background-color: ${theme.color.primaryColor};
  height: 100%;
  transition: width 0.3s ease-in-out;
`

export default function LoadingIndicator(props) {
  const { projectData } = props
  const [loadingProgressValue, setLoadingProgressValue] = useState(0)
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true)
  const [showLoadingBar, setShowLoadingBar] = useState(true)

  useEffect(() => {
    if (!projectData.count || !projectData.results) {
      return
    }
    setLoadingProgressValue(Math.floor((projectData.results.length / projectData.count) * 100))
  }, [projectData])

  useEffect(() => {
    if (loadingProgressValue === 100) {
      setShowLoadingBar(false)
      setTimeout(() => {
        setShowLoadingIndicator(false)
      }, 10000)
    }
  }, [loadingProgressValue])

  return showLoadingIndicator === true ? (
    <StyledLoadingContainer showLoadingBar={showLoadingBar}>
      <header>
        {loadingProgressValue === 100
          ? 'All sites loaded'
          : `Loading sites ${loadingProgressValue}%`}
      </header>
      {showLoadingBar === true ? (
        <StyledProgressBarContainer>
          <StyledProgressBar value={loadingProgressValue} />
        </StyledProgressBarContainer>
      ) : null}
    </StyledLoadingContainer>
  ) : null
}

LoadingIndicator.propTypes = {
  projectData: PropTypes.shape({
    count: PropTypes.number,
    results: PropTypes.array,
  }).isRequired,
}
