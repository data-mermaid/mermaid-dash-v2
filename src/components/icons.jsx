import { InlineIcon } from '@iconify/react'
import hamburgerMenu from '@iconify-icons/mdi/hamburger-menu'
import login from '@iconify-icons/mdi/login'
import menuDown from '@iconify-icons/mdi/menu-down'
import user from '@iconify-icons/mdi/user'
import closeIcon from '@iconify-icons/mdi/close'
import copy from '@iconify-icons/mdi/content-copy'
import mapOutline from '@iconify-icons/mdi/map-outline'
import table from '@iconify-icons/mdi/table'
import personCircle from '@iconify-icons/mdi/person-circle'
import checkboxOutline from '@iconify-icons/mdi/check-box-outline'
import checkboxBlankOutline from '@iconify-icons/mdi/checkbox-blank-outline'
import formatListChecks from '@iconify-icons/mdi/format-list-checks'

export const HamburgerMenu = (props) => <InlineIcon icon={hamburgerMenu} {...props} />
export const LoginIcon = (props) => <InlineIcon icon={login} {...props} />
export const IconUser = (props) => <InlineIcon icon={user} {...props} />
export const IconDown = (props) => <InlineIcon icon={menuDown} {...props} />
export const IconClose = (props) => <InlineIcon icon={closeIcon} {...props} />
export const IconCopy = (props) => <InlineIcon icon={copy} {...props} />
export const IconMapOutline = (props) => <InlineIcon icon={mapOutline} {...props} />
export const IconTable = (props) => <InlineIcon icon={table} {...props} />
export const IconPersonCircle = (props) => <InlineIcon icon={personCircle} {...props} />
export const IconCheckboxOutline = (props) => <InlineIcon icon={checkboxOutline} {...props} />
export const IconCheckboxBlankOutline = (props) => (
  <InlineIcon icon={checkboxBlankOutline} {...props} />
)
export const IconFormatListChecks = (props) => <InlineIcon icon={formatListChecks} {...props} />
