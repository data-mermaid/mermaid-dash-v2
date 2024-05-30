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
import arrowUp from '@iconify-icons/mdi/arrow-up'
import arrowDown from '@iconify-icons/mdi/arrow-down'

export const HamburgerMenu = (props) => <InlineIcon icon={hamburgerMenu} {...props} />
export const LoginIcon = (props) => <InlineIcon icon={login} {...props} />
export const IconUser = (props) => <InlineIcon icon={user} {...props} />
export const IconDown = (props) => <InlineIcon icon={menuDown} {...props} />
export const IconClose = (props) => <InlineIcon icon={closeIcon} {...props} />
export const IconCopy = (props) => <InlineIcon icon={copy} {...props} />
export const IconMapOutline = (props) => <InlineIcon icon={mapOutline} {...props} />
export const IconTable = (props) => <InlineIcon icon={table} {...props} />
export const IconPersonCircle = (props) => <InlineIcon icon={personCircle} {...props} />
export const IconSortDown = (props) => <InlineIcon icon={arrowUp} {...props} />
export const IconSortUp = (props) => <InlineIcon icon={arrowDown} {...props} />
