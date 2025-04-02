import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import useIsMounted from '../../../hooks/useIsMounted'

/**
 * Button that shows content in drop down on click
 */
const DropdownContainer = styled.div`
  padding: 0;
  margin: 0;
  position: absolute;
  z-index: 101;
  left: 0;
  min-width: 100%;
`
const PositionedAncestor = styled.div`
  position: relative;
  width: ${(props) => props?.width || 'max-content'};
`

const HideShow = ({
  contents,
  button,
  closeOnClickWithin = true,
  customStyleProps = {},
  onToggle,
}) => {
  const [showItems, setShowItems] = useState(false)
  const buttonRef = useRef(null)
  const contentsRef = useRef(null)
  const isMounted = useIsMounted()

  const toggleShowItems = () => {
    setShowItems(!showItems)
    onToggle?.(!showItems)
  }

  const _hideItemsIfClickedOutside = useEffect(() => {
    const handleClick = (event) => {
      const currentButtonRef = buttonRef.current
      const currentContentsRef = contentsRef.current

      // Proceed if the click is not on the button
      if (!(currentButtonRef && currentButtonRef.contains(event.target))) {
        if (closeOnClickWithin) {
          setShowItems(false)
          onToggle?.(false)
        }

        if (!closeOnClickWithin) {
          // Check the click was not within the HideShow contents
          // Use when contents have other click handlers e.g. bell notifications
          if (currentContentsRef && !currentContentsRef.contains(event.target)) {
            setShowItems(false)
            onToggle?.(false)
          }
        }
      }
    }

    window.addEventListener('click', (event) => {
      if (isMounted.current) {
        handleClick(event)
      }
    })

    return () => {
      window.removeEventListener('click', (event) => {
        handleClick(event)
      })
    }
  }, [buttonRef, contentsRef, closeOnClickWithin, isMounted, onToggle])

  const buttonForRender = React.cloneElement(button, {
    ref: buttonRef,
    onClick: toggleShowItems,
  })

  return (
    <PositionedAncestor {...customStyleProps}>
      {buttonForRender}
      {showItems && <span ref={contentsRef}>{contents}</span>}
    </PositionedAncestor>
  )
}

HideShow.propTypes = {
  button: PropTypes.node.isRequired,
  contents: PropTypes.node.isRequired,
  closeOnClickWithin: PropTypes.bool,
  customStyleProps: PropTypes.object,
  onToggle: PropTypes.func,
}

export default HideShow
export { DropdownContainer }
