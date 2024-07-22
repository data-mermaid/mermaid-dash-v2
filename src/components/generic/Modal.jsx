import PropTypes from 'prop-types'
import { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { IconClose } from '../../styles/Icons/icons'
import theme from '../../styles/theme'
import { CloseButton } from './buttons'
import { mediaQueryPhoneOnly } from '../../styles/mediaQueries'

const StyledDialogOverlay = styled('div')`
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100dvh;
  top: 0;
  left: 0;
  position: fixed;
  display: grid;
  place-items: center;
  z-index: 103;
  cursor: default;
`
const StyledDialog = styled('div')`
  padding: 0;
  margin: 0;
  min-width: 30rem;
  width: ${(props) => props.$modalCustomWidth};
  max-width: 96rem;
  background: ${theme.color.tableRowEven};
  ${(props) => props.$modalCustomHeight !== '' && `height: ${props.$modalCustomHeight};`}
  display: flex;
  flex-direction: column;
`
const ModalTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 3rem ${theme.spacing.medium} 0 3rem;
  color: ${theme.color.textColor};
  h2 {
    justify-self: start;
    align-self: center;
    margin: 0;
  }
  button {
    align-self: top;
    justify-self: end;
  }
`

const ModalToolbar = styled.div`
  padding: 0 ${theme.spacing.medium};
`
const ModalContent = styled.div`
  ${(props) =>
    !props.$contentOverflowIsVisible &&
    css`
      overflow: auto;
    `}
  padding: ${theme.spacing.medium};
  padding-bottom: 3rem;
  flex-grow: 1;
`
const ModalFooter = styled.div`
  padding: ${theme.spacing.medium};
  display: grid;
  grid-auto-columns: auto auto;
  background: ${theme.color.white};
  ${mediaQueryPhoneOnly(css`
    > * {
      display: block;
      text-align: center;
    }
    * > button {
      margin-top: ${theme.spacing.buttonSpacing};
      margin-bottom: ${theme.spacing.buttonSpacing};
    }
  `)}
  * > button {
    svg {
      margin-right: ${theme.spacing.small};
    }
    &:not(:last-child) {
      margin-right: ${theme.spacing.buttonSpacing};
    }
    &:first-child {
      margin-left: 0;
    }
  }
`
const ModalLoadingIndicatorWrapper = styled('div')`
  position: static;
  width: 100%;
  padding: 5rem 0;
  .loadingWrapper {
    position: static;
    .objectWrapper {
      div {
        background-color: ${theme.color.background};
      }
    }
    .loadingPrimary {
      color: ${theme.color.background};
      width: auto;
      position: relative;
      top: -55%;
    }
  }
`
const LeftFooter = styled('div')`
  justify-self: start;
`
const RightFooter = styled('div')`
  justify-self: end;
`

const Modal = ({
  title,
  mainContent,
  isOpen,
  onDismiss,
  footerContent,
  contentOverflowIsVisible = false,
  toolbarContent = undefined,
  modalCustomWidth = '50vw',
  modalCustomHeight = '',
}) => {
  const _closeModalWithEscapeKey = useEffect(() => {
    const close = (event) => {
      if (event.code === 'Escape') {
        onDismiss()
      }
    }

    window.addEventListener('keydown', close)

    return () => window.removeEventListener('keydown', close)
  }, [onDismiss])

  return (
    isOpen && (
      <StyledDialogOverlay aria-label={`${title} Modal`}>
        <StyledDialog
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-content"
          $modalCustomWidth={modalCustomWidth}
          $modalCustomHeight={modalCustomHeight}
        >
          {title ? (
            <ModalTitle>
              <h2 id="modal-title">{title}</h2>
              <CloseButton type="button" className="close-button" onClick={onDismiss}>
                <IconClose aria-label="close" />
              </CloseButton>
            </ModalTitle>
          ) : null}
          <ModalToolbar>{toolbarContent}</ModalToolbar>
          <ModalContent id="modal-content" $contentOverflowIsVisible={contentOverflowIsVisible}>
            {mainContent}
          </ModalContent>
          <ModalFooter>{footerContent}</ModalFooter>
        </StyledDialog>
      </StyledDialogOverlay>
    )
  )
}

Modal.propTypes = {
  footerContent: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mainContent: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  contentOverflowIsVisible: PropTypes.bool,
  toolbarContent: PropTypes.node,
  modalCustomWidth: PropTypes.string,
  modalCustomHeight: PropTypes.string,
}

export default Modal
export { ModalLoadingIndicatorWrapper, LeftFooter, RightFooter, StyledDialogOverlay, ModalContent }
