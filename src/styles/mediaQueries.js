import { css } from 'styled-components'

const mediaQueryPhoneOnly = (content) => css`
  @media (max-width: 599px) {
    ${content};
  }
`
const mediaQueryForTabletPortraitUp = (content) => css`
  @media (min-width: 600px) {
    ${content};
  }
`
const mediaQueryTabletLandscapeOnly = (content) => css`
  @media (max-width: 1080px) {
    ${content};
  }
`
const mediaQueryTabletLandscapeUp = (content) => css`
  @media (min-width: 1081px) {
    ${content};
  }
`

const mediaQueryWidthMax1280 = (content) => css`
  @media (max-width: 1280px) {
    ${content};
  }
`

const mediaQueryForDesktopUp = (content) => css`
  @media (min-width: 1300px) {
    ${content};
  }
`

const mediaQueryForMediumDesktop = (content) => css`
  @media (max-width: 1510px) {
    ${content};
  }
`
const mediaQueryForBigDesktopUp = (content) => css`
  @media (min-width: 1800px) {
    ${content};
  }
`

const mediaQueryHeightMax680 = (content) => css`
  @media (max-height: 680px) {
    ${content};
  }
`

const mediaQueryHeightMax960 = (content) => css`
  @media (max-height: 960px) {
    ${content};
  }
`

const hoverState = (content) => css`
  @media (hover: hover) {
    &:hover:not([disabled]) {
      ${content};
    }
  }
`

export {
  mediaQueryPhoneOnly,
  mediaQueryForBigDesktopUp,
  mediaQueryTabletLandscapeUp,
  mediaQueryWidthMax1280,
  mediaQueryTabletLandscapeOnly,
  mediaQueryForTabletPortraitUp,
  mediaQueryForDesktopUp,
  mediaQueryForMediumDesktop,
  mediaQueryHeightMax680,
  mediaQueryHeightMax960,
  hoverState,
}
