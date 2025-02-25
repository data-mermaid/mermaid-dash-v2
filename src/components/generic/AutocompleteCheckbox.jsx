import PropTypes from 'prop-types'
import { matchSorter } from 'match-sorter'
import styled from 'styled-components'
import theme from '../../styles/theme'
import { IconClose } from '../../assets/icons'
import { Autocomplete, TextField } from '@mui/material'
import { MermaidChip, MermaidListSubheader, MermaidMenuItem } from './MermaidMui'

const deleteIconSize = {
  height: '15px',
  width: '15px',
}

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: ${theme.color.white};
    border-radius: 0;
    font-size: ${theme.typography.defaultFontSize};
    font-family: ${theme.typography.fontFamily};
    color: ${theme.color.textColor};
    border: 1px solid ${theme.color.grey0};
  }
`

const AutocompleteCheckbox = ({
  selectedValues,
  displayOptions,
  remainingOptions = [],
  autocompleteGroupBy,
  onOpen,
  onChange,
  onDelete,
}) => {
  const options = [...displayOptions, ...remainingOptions]

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedValues}
      onChange={(e, newValue) => onChange(newValue)}
      onOpen={onOpen}
      groupBy={autocompleteGroupBy}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      filterOptions={(options, { inputValue }) => {
        // Group options by category
        const groupedOptions = options.reduce((acc, option) => {
          const group = autocompleteGroupBy(option)
          if (!acc[group]) {
            acc[group] = []
          }

          acc[group].push(option)

          return acc
        }, {})

        // Apply matchSorter filtering within each group
        const filteredGroups = Object.entries(groupedOptions).reduce((acc, [group, items]) => {
          const filteredItems = matchSorter(items, inputValue, {
            keys: [(item) => item],
          })

          if (filteredItems.length) {
            acc[group] = filteredItems
          }

          return acc
        }, {})

        // Flatten the grouped options while maintaining their order
        return Object.values(filteredGroups).flat()
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props || {}

        return (
          <MermaidMenuItem key={key} {...optionProps}>
            <input type="checkbox" checked={selected} readOnly />
            {option}
          </MermaidMenuItem>
        )
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index })

          return (
            <MermaidChip
              key={key}
              label={option}
              {...tagProps}
              onDelete={() => onDelete(option)}
              deleteIcon={
                <IconClose onMouseDown={(event) => event.stopPropagation()} {...deleteIconSize} />
              }
            />
          )
        })
      }
      renderInput={(params) => <StyledTextField {...params} />}
      renderGroup={(params) => (
        <div key={params.key}>
          <MermaidListSubheader>{params.group}</MermaidListSubheader>
          <div>{params.children}</div>
        </div>
      )}
    />
  )
}

AutocompleteCheckbox.propTypes = {
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  displayOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  remainingOptions: PropTypes.arrayOf(PropTypes.string),
  autocompleteGroupBy: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default AutocompleteCheckbox
