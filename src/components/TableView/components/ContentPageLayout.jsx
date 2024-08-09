import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { mediaQueryPhoneOnly, mediaQueryTabletLandscapeOnly } from '../../../styles/mediaQueries'
import theme from '../../../styles/theme'

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
`
const contentStyles = css`
  background: ${theme.color.white};
`

const Content = styled('div')`
  ${contentStyles};
  height: 100%;
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

const ContentPageLayout = ({ content }) => {
  return (
    <MainContentPageLayout>
      <NavAndContentLayout>
        <ContentWrapper>
          <Content>{content}</Content>
        </ContentWrapper>
      </NavAndContentLayout>
    </MainContentPageLayout>
  )
}

ContentPageLayout.propTypes = {
  content: PropTypes.node.isRequired,
}

export default ContentPageLayout
export { ContentPageToolbarWrapper }
