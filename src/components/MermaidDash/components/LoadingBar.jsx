import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../../styles/theme'

const LoadingBarContainer = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  background-color: ${theme.color.callout};
  height: 4px;
  width: ${({ width }) => width}%;
  opacity: ${({ showLoadingBar }) => (showLoadingBar ? 1 : 0)};
  transition:
    width 1s ease-in-out,
    opacity 1s ease-in-out;
`

const LoadingBar = ({ showLoadingBar, currentProgress, finalProgress }) => {
  const [loadingProgressValue, setLoadingProgressValue] = useState(0)

  const _calculateCurrentLoadingPercentage = useEffect(() => {
    if (finalProgress === 0) {
      return
    }
    setLoadingProgressValue(Math.floor((currentProgress / finalProgress) * 100))
  }, [currentProgress, finalProgress])

  return <LoadingBarContainer width={loadingProgressValue} showLoadingBar={showLoadingBar} />
}

LoadingBar.propTypes = {
  showLoadingBar: PropTypes.bool.isRequired,
  currentProgress: PropTypes.number.isRequired,
  finalProgress: PropTypes.number.isRequired,
}

export default LoadingBar
