import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
// import domPurify from 'dompurify'
import theme from '../../theme'

export const TooltipPopup = styled('span')`
  display: block;
  max-width:  ${(props) => props.maxWidth || '25rem'};
  width: max-content;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  clip-path: polygon(
    //top left
    0 0,
    //top right
    100% 0,
    //bottom right
    100% calc(100% - 15px),
    // right size of arrow
    calc(50% + 10px) calc(100% - 15px),
    //bottom peak
    50% 100%,
    // left side of arrow
    calc(50% - 10px) calc(100% - 15px),
    //bottom left
    0 calc(100% - 15px)
  );
}
  padding: 1em;
  padding-bottom: calc(1rem + 15px);
  bottom: ${(props) => props.bottom || '4em'};
  left: ${(props) => props.left || '0'};
  white-space: normal;
  z-index: 100;
  text-align: left;
`

const ColumnHeaderToolTip = ({ helperText, bottom, left, top, maxWidth, html }) => {
  // const sanitizeHtml = domPurify.sanitize
  const dirtyHTML = html
  // const cleanHTML = sanitizeHtml(dirtyHTML)

  return (
    <TooltipPopup
      role="tooltip"
      aria-labelledby="tooltip"
      bottom={bottom}
      left={left}
      maxWidth={maxWidth}
      top={top}
    >
      {/* eslint-disable-next-line react/no-danger */}
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html /* cleanHTML */ }} />
      ) : (
        <span>{helperText}</span>
      )}
    </TooltipPopup>
  )
}

export default ColumnHeaderToolTip

ColumnHeaderToolTip.defaultProps = {
  bottom: '4em',
  left: '0em',
  maxWidth: '25rem',
  top: '0',
  html: '',
  helperText: '',
}

ColumnHeaderToolTip.propTypes = {
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  bottom: PropTypes.string,
  left: PropTypes.string,
  top: PropTypes.string,
  maxWidth: PropTypes.string,
  html: PropTypes.string,
}
