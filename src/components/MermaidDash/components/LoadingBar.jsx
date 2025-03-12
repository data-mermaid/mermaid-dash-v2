import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../../styles/theme'

const LoadingBarContainer = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  background-color: ${theme.color.primaryColor};
  height: 4px;
  width: ${({ $value }) => $value}%;
  transition: width 1s ease-in-out;
`

const LoadingBar = ({
  showLoadingIndicator,
  setShowLoadingIndicator,
  currentProgress,
  finalProgress,
}) => {
  const [loadingProgressValue, setLoadingProgressValue] = useState(0)

  const _calculateCurrentLoadingPercentage = useEffect(() => {
    if (finalProgress > 0) {
      setLoadingProgressValue(Math.floor((currentProgress / finalProgress) * 100))
    }
  }, [currentProgress, finalProgress])

  const _hideLoadingBarAfterTimeout = useEffect(() => {
    if (loadingProgressValue === 100) {
      const timeout = setTimeout(() => setShowLoadingIndicator(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [loadingProgressValue, setShowLoadingIndicator])

  return showLoadingIndicator === true && <LoadingBarContainer $value={loadingProgressValue} />
}

LoadingBar.propTypes = {
  showLoadingIndicator: PropTypes.bool.isRequired,
  setShowLoadingIndicator: PropTypes.func.isRequired,
  currentProgress: PropTypes.number.isRequired,
  finalProgress: PropTypes.number.isRequired,
}

export default LoadingBar
