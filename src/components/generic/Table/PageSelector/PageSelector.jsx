import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { hoverState } from '../../../../styles/mediaQueries'
import { ButtonThatLooksLikeLink } from '../../buttons'
import theme from '../../../../styles/theme'

const PaginationButtonStyles = css`
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  &:disabled {
    cursor: not-allowed;
    color: ${theme.color.primaryDisabledColor};
  }
  &:not([disabled], .paginationCurrentPage) {
    ${hoverState(css`
      background: ${theme.color.secondaryHover};
    `)}
  }
`
const PageNumberButtons = styled(ButtonThatLooksLikeLink)`
  ${PaginationButtonStyles}
  &.paginationCurrentPage {
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  }
`
const PaginationLinkButton = styled(ButtonThatLooksLikeLink)`
  ${PaginationButtonStyles}
`
// eslint-disable-next-line react/prop-types
const PageButton = ({ pageIndex, currentPageIndex, onGoToPage }) => {
  const pageLabel = pageIndex + 1
  const isCurrentPage = currentPageIndex === pageIndex

  return (
    <PageNumberButtons
      className={isCurrentPage ? 'paginationCurrentPage' : undefined}
      aria-current={isCurrentPage}
      onClick={() => onGoToPage(pageIndex)}
      key={`pagination-button-${pageIndex}`}
    >
      {pageLabel}
    </PageNumberButtons>
  )
}

/**
 * Pagination control - for user to select which page is shown
 */

const PageSelector = ({
  currentPageIndex,
  nextDisabled,
  onGoToPage,
  onNextClick,
  onPreviousClick,
  pageCount,
  previousDisabled,
}) => {
  const [pageButtons, setPageButtons] = useState([])

  const _generatePageButtons = useEffect(() => {
    const pageButtonPropsThatChangeLess = { currentPageIndex, onGoToPage }

    const renderEightOrLessPageButtons = () => {
      return Array.from({ length: pageCount }, (_, index) => {
        const buttonProps = {
          ...pageButtonPropsThatChangeLess,
          pageIndex: index,
        }
        const key = `pagination-button-${index + 1}`

        return <PageButton key={key} {...buttonProps} />
      })
    }

    const renderMoreThanEightPageButtons = () => {
      const middleButtons = []

      const lastPage = pageCount
      const currentlySelectedPage = currentPageIndex + 1

      const populateMiddleButtons = () => {
        if (currentlySelectedPage === 3) {
          middleButtons.push(<PageButton {...pageButtonPropsThatChangeLess} pageIndex={1} />)
        }
        if (currentlySelectedPage > 3) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex - 2} />,
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex - 1} />,
          )
        }
        if (currentlySelectedPage !== 1 && currentlySelectedPage !== lastPage) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex} />,
          )
        }
        if (currentlySelectedPage < lastPage - 1) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex + 1} />,
          )
        }
        if (currentlySelectedPage < lastPage - 2) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex + 2} />,
          )
        }
      }

      const manageMiddleButtonEllipses = () => {
        if (currentlySelectedPage > 4) {
          middleButtons.unshift(<span>...</span>)
        }
        if (currentlySelectedPage < lastPage - 3) {
          middleButtons.push(<span>...</span>)
        }
      }

      populateMiddleButtons()
      manageMiddleButtonEllipses()

      return (
        <>
          <PageButton {...pageButtonPropsThatChangeLess} pageLabel="1" pageIndex={0} />
          {middleButtons.map((button, index) => ({
            ...button,
            key: `middle-button-${index}`,
          }))}
          <PageButton
            {...pageButtonPropsThatChangeLess}
            pageLabel={lastPage}
            pageIndex={lastPage - 1}
          />
        </>
      )
    }

    if (pageCount > 8) {
      setPageButtons(renderMoreThanEightPageButtons())
    } else {
      setPageButtons(renderEightOrLessPageButtons())
    }
  }, [pageCount, currentPageIndex, onGoToPage])

  return (
    <div data-testid="page-control">
      <PaginationLinkButton onClick={onPreviousClick} disabled={previousDisabled}>
        Back
      </PaginationLinkButton>
      {pageButtons}
      <PaginationLinkButton onClick={onNextClick} disabled={nextDisabled}>
        Next
      </PaginationLinkButton>
    </div>
  )
}

PageSelector.propTypes = {
  nextDisabled: PropTypes.bool.isRequired,
  onGoToPage: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  previousDisabled: PropTypes.bool.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
}

export default PageSelector
