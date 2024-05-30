import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { mediaQueryPhoneOnly, mediaQueryTabletLandscapeOnly } from '../../../../styles/mediaQueries'
import theme from '../../../../theme'
import { Column } from '../../../generic/positioning'

const contentPadding = theme.spacing.xsmall
const MainContentPageLayout = styled('div')`
  display: grid;
  grid-template-rows: auto 1fr;
  background: ${theme.color.backgroundColor};
`
const ContentWrapper = styled('div')`
  padding: ${contentPadding} 0 0 ${contentPadding};
`
const NavAndContentLayout = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
`
const contentStyles = css`
  background: ${theme.color.white};
`

const ContentToolbar = styled('div')`
  ${contentStyles};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  // border-bottom: solid ${theme.spacing.borderMedium} ${theme.color.backgroundColor};
  margin-bottom: 0;
  z-index: 100;
  ${(props) =>
    props.isToolbarSticky &&
    css`
      position: sticky;
      top: ${theme.spacing.headerHeight};
    `}
`

const Content = styled('div')`
  ${contentStyles};
  margin-top: 0px;
  height: calc(100%);
`

const ContentPageToolbarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  ${mediaQueryPhoneOnly(css`
    flex-direction: column;
    align-items: start;
  `)}
  ${mediaQueryTabletLandscapeOnly(css`
    padding: ${theme.spacing.small};
  `)}
`

const ContentPageLayout = ({
  content,
  toolbar = undefined,
  isPageContentLoading = false,
  isToolbarSticky = false,
  subNavNode = null,
}) => {
  return (
    <>
      <MainContentPageLayout>
        <NavAndContentLayout>
          <Column></Column>
          <ContentWrapper>
            <>
              {toolbar && (
                <ContentToolbar isToolbarSticky={isToolbarSticky}>{toolbar}</ContentToolbar>
              )}
              <Content>{content}</Content>
            </>
          </ContentWrapper>
        </NavAndContentLayout>
      </MainContentPageLayout>
    </>
  )
}

ContentPageLayout.propTypes = {
  content: PropTypes.node.isRequired,
  isPageContentLoading: PropTypes.bool,
  toolbar: PropTypes.node,
  isToolbarSticky: PropTypes.bool,
}

export default ContentPageLayout
export { ContentPageToolbarWrapper }
