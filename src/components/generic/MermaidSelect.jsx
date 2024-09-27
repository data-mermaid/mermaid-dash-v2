import { MenuItem, Select } from '@mui/material'
import styled from 'styled-components'
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

export const MermaidMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    font-size: ${theme.typography.defaultFontSize};
  }
`

export const MermaidSelect = (props) => {
  return <Select sx={selectCustomStyles} MenuProps={selectCustomStyles.MenuProps} {...props} />
}
