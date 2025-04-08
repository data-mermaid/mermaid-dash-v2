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

const mediaQueryWidthMax1280 = (content) => css`
  @media (max-width: 1280px) {
    ${content};
  }
`

const mediaQuery960To1200 = (content) => css`
  @media (min-width: 960px) and (max-width: 1300px) {
    ${content};
  }
`

const mediaQueryForTabletLandscapeUp = (content) => css`
  @media (min-width: 900px) {
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
  mediaQueryForTabletLandscapeUp,
  mediaQueryWidthMax1280,
  mediaQuery960To1200,
  mediaQueryTabletLandscapeOnly,
  mediaQueryForTabletPortraitUp,
  mediaQueryForDesktopUp,
  mediaQueryForMediumDesktop,
  mediaQueryHeightMax680,
  hoverState,
}
