import styled from 'styled-components'
import {
  Chip,
  FormControl,
  OutlinedInput,
  MenuItem,
  Select,
  ListSubheader,
  TextField,
} from '@mui/material'
import theme from '../../styles/theme'

const selectCustomStyles = {
  '&.MuiInputBase-root': {
    minHeight: '3.5rem',
  },
  '& .MuiSelect-select': {
    paddingRight: '1rem',
    paddingLeft: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
  MenuProps: {
    PaperProps: {
      sx: {
        maxHeight: '50vh',
      },
    },
  },
}

export const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: ${theme.color.white};
    border-radius: 0;
    font-size: ${theme.typography.defaultFontSize};
    font-family: ${theme.typography.fontFamily};
    color: ${theme.color.textColor};
    border: 1px solid ${theme.color.grey0};
  }
`

export const MermaidFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    width: 100%;
  }
`
export const MermaidFormContainer = styled.div`
  border: 1px solid ${theme.color.grey0};
`

export const MermaidOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    background-color: ${theme.color.white};
    border-radius: 0;
    font-size: ${theme.typography.defaultFontSize};
    font-family: ${theme.typography.fontFamily};
    color: ${theme.color.textColor};
  }
  .MuiChip-label {
    font-size: ${theme.typography.defaultFontSize};
    font-family: ${theme.typography.fontFamily};
    color: ${theme.color.textColor};
  }
`
export const MermaidChip = styled(Chip)`
  &.MuiChip-root {
    border-radius: 0.5rem;
    border: 0.5px solid ${theme.color.black};
    font-size: ${theme.typography.defaultFontSize};
  }
`

export const MermaidMenuItem = styled(MenuItem)`
  .menu-item-content {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    width: 100%;
  }

  .menu-item-checkbox {
    margin-top: 5px;
  }

  .menu-item-text {
    flex: 1;
    word-break: break-word;
    white-space: normal;
    font-size: ${theme.typography.defaultFontSize};
  }
`

export const MermaidSelect = (props) => {
  return <Select sx={selectCustomStyles} MenuProps={selectCustomStyles.MenuProps} {...props} />
}

export const MermaidListSubheader = styled(ListSubheader)`
  &.MuiListSubheader-root {
    font-weight: 600;
    color: ${theme.color.primaryColor};
    font-size: ${theme.typography.defaultFontSize};
    top: -8px;
  }
`
