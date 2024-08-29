import { FormControl, MenuItem, OutlinedInput, Chip, TextField, ListSubheader } from '@mui/material'
import styled from 'styled-components'
import theme from '../../styles/theme'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../styles/mediaQueries'
import { css } from 'styled-components'

export const StyledHeader = styled.h2`
  font-size: ${theme.typography.defaultFontSize};
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`

export const StyledProjectsHeader = styled(StyledHeader)`
  display: flex;
  justify-content: space-between;
`

export const StyledFilterPaneContainer = styled.div`
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
    border-radius: 0;
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

export const StyledExpandFilters = styled.button`
  margin: 1.5rem 0;
  cursor: pointer;
  text-decoration: underline;
  border: none;
  background: none;
  padding: 0;
`

export const ShowMoreFiltersContainer = styled.div`
  padding: 0.5rem 0 1.5rem 0.8rem;
  background-color: ${theme.color.grey4};
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

export const StyledProjectListContainer = styled.div`
  background-color: ${theme.color.white};
  border: 1px solid ${theme.color.grey0};
  word-break: break-word;
  overflow-wrap: break-word;
`

export const StyledMethodListContainer = styled.div`
  margin-right: 1rem;
  border: 1px solid ${theme.color.grey0};
`

export const StyledUnorderedList = styled.ul`
  list-style-type: none;
  margin: 0;
  background-color: ${theme.color.white};
  padding: 0;
`

export const StyledDateInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 1rem;
  justify-content: space-between;
`

export const StyledDateInput = styled.div`
  position: relative;
  width: calc(50% - 0.5rem);
  margin-bottom: 1rem;
  input {
    width: 100%;
    padding: 0.5rem;
    background-color: ${theme.color.white};
    border: 1px solid ${theme.color.grey0};
    border-radius: 0;
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

export const StyledListSubheader = styled(ListSubheader)`
  &.MuiListSubheader-root {
    font-weight: 600;
    color: ${theme.color.primaryColor};
    font-size: ${theme.typography.defaultFontSize};
  }
`
export const StyledClickableArea = styled.div`
  cursor: pointer;
  display: flex;
  padding: 0.5rem;
  flex-grow: 1;
  ${hoverState(css`
    background-color: ${theme.color.tableRowHover};
  `)}
`

export const StyledLabel = styled.label`
  cursor: pointer;
  margin: 0.2rem;
  flex-grow: 1;
`

export const StyledCategoryContainer = styled.div`
  border: 1px solid ${theme.color.grey0};
  background-color: ${theme.color.white};
  margin-right: 1rem;
`
export const StyledFormContainer = styled.div`
  border: 1px solid ${theme.color.grey0};
`

export const StyledEmptyListItem = styled.div`
  padding: 0.5rem 1rem;
`

export const TieredStyledClickableArea = styled(StyledClickableArea)`
  padding-left: 2rem;
`

export const ToggleMethodDataSharingButton = styled.button`
  border: 0;
  background-color: ${theme.color.white};
  cursor: pointer;
  ${hoverState(css`
    background-color: ${theme.color.secondaryColor};
  `)}
`

export const ExpandableFilterRowContainer = styled.div`
  display: flex;
`

export const StyledLi = styled.li`
  display: flex;
  flex-direction: column;
`
