import { FormControl, MenuItem, OutlinedInput, Chip, TextField } from '@mui/material'
import styled from 'styled-components'
import theme from '../../styles/theme'
import { mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'
import { css } from 'styled-components'

export const StyledHeader = styled('h2')`
  font-size: ${theme.typography.defaultFontSize};
  font-weight: bold;
`

export const StyledProjectsHeader = styled(StyledHeader)`
  display: flex;
  justify-content: space-between;
`

export const StyledFilterPaneContainer = styled('div')`
  padding: 1rem;
  min-width: 35rem;
  ${mediaQueryTabletLandscapeOnly(css`
    min-width: 80vw;
    min-height: 85dvh;
  `)}
`

export const StyledFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    width: 100%;
  }
`

export const StyledOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    background-color: ${theme.color.white};
  }
  .MuiChip-label {
    font-size: ${theme.typography.smallFontSize};
  }
`

export const StyledChip = styled(Chip)`
  &.MuiChip-root {
    border-radius: 0.5rem;
    border: 0.5px solid ${theme.color.black};
    font-size: ${theme.typography.defaultFontSize};
  }
`

export const StyledExpandFilters = styled('button')`
  margin: 1.5rem 0;
  cursor: pointer;
  text-decoration: underline;
  border: none;
  background: none;
  padding: 0;
`

export const ShowMoreFiltersContainer = styled('div')`
  border-left: 0.5rem solid ${theme.color.grey4};
  padding-left: 0.8rem;
`

export const StyledProjectNameFilter = styled(TextField)`
  width: 100%;
  background-color: ${theme.color.white};
  fieldset {
    border-radius: 0;
  }
  input {
    padding: 0.5rem 0 0.5rem 1rem;
    font-size: ${theme.typography.defaultFontSize};
  }
  & input::placeholder {
    font-style: italic;
  }
  &.MuiFormControl-root {
    border: 1px solid ${theme.color.grey0};
    border-bottom: none;
  }
`

export const StyledProjectListContainer = styled('div')`
  background-color: ${theme.color.white};
  border: 1px solid ${theme.color.grey0};
  word-break: break-word;
  overflow-wrap: break-word;
`

export const StyledUnorderedList = styled('ul')`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

export const StyledDateInput = styled.div`
  position: relative;
  width: calc(50% - 0.3rem);
  margin-bottom: 1rem;
  margin-right: 0.3rem;
  input {
    width: 100%;
    padding: 0.5rem;
    background-color: ${theme.color.white};
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .clear-button {
    position: absolute;
    right: 1.8rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
  }
`

export const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    font-size: ${theme.typography.defaultFontSize};
  }
`
export const ExpandClickableArea = styled('div')`
  cursor: pointer;
  display: flex;
  alignitems: center;
  &:hover {
    background-color: ${theme.color.tableRowHover};
  }
`

export const StyledLabel = styled('label')`
  cursor: pointer;
`
