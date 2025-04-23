import PropTypes from 'prop-types'
import { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { IconClose } from '../../assets/icons'
import theme from '../../styles/theme'
import { CloseButton } from './buttons'
import { mediaQueryPhoneOnly } from '../../styles/mediaQueries'

const StyledDialogOverlay = styled.div`
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
const StyledDialog = styled.div`
  padding: 0;
  margin: 0;
  min-width: 60rem;
  width: ${(props) => props.$modalCustomWidth || 'auto'};
  max-width: 110rem;
  background: ${theme.color.tableRowEven};
  ${(props) => props.$modalCustomHeight && `height: ${props.$modalCustomHeight};`}
  display: flex;
  flex-direction: column;
  ${mediaQueryPhoneOnly(css`
    min-width: 35rem;
  `)}
`
const ModalTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.spacing.medium};
  padding-bottom: 0;
  color: ${theme.color.textColor};
  text-transform: capitalize;
  h2 {
    justify-self: start;
    align-self: center;
    margin: 0;
  }
  button {
    align-self: top;
    justify-self: end;
  }
  ${mediaQueryPhoneOnly(css`
    padding: 1rem 1rem 0rem 1rem;
  `)}
`

const ModalToolbar = styled.div`
  padding: ${theme.spacing.medium};
`
const ModalContent = styled.div`
  ${(props) =>
    !props.$contentOverflowIsVisible &&
    css`
      overflow: auto;
    `}
  padding: ${theme.spacing.medium};
  padding-top: 0;
  flex-grow: 1;
  ${mediaQueryPhoneOnly(css`
    padding: 0rem 1rem 1rem 1rem;
  `)}
`
const ModalFooter = styled.div`
  padding: ${theme.spacing.medium};
  display: flex;
  justify-content: space-between;
  background: ${theme.color.white};
  gap: 5px;
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
const ModalLoadingIndicatorWrapper = styled.div`
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
const LeftFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const RightFooter = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  justify-content: flex-end;
  min-width: 250px;
`

const Modal = ({
  title,
  mainContent,
  isOpen,
  onDismiss,
  footerContent,
  contentOverflowIsVisible = false,
  toolbarContent = undefined,
  modalCustomWidth = '',
  modalCustomHeight = '',
  hideCloseIcon = false,
}) => {
  const _closeModalWithEscapeKey = useEffect(() => {
    if (hideCloseIcon) {
      return
    }

    const close = (event) => {
      if (event.code === 'Escape') {
        onDismiss()
      }
    }

    window.addEventListener('keydown', close)

    return () => window.removeEventListener('keydown', close)
  }, [onDismiss, hideCloseIcon])

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
          {title && (
            <ModalTitle>
              <h2 id="modal-title">{title}</h2>
              {!hideCloseIcon && (
                <CloseButton type="button" className="close-button" onClick={onDismiss}>
                  <IconClose aria-label="close" />
                </CloseButton>
              )}
            </ModalTitle>
          )}
          {toolbarContent && <ModalToolbar>{toolbarContent}</ModalToolbar>}
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
  hideCloseIcon: PropTypes.bool,
}

export default Modal
export { ModalLoadingIndicatorWrapper, LeftFooter, RightFooter, StyledDialogOverlay, ModalContent }
