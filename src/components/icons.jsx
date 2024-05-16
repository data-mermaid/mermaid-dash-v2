import { InlineIcon } from '@iconify/react'
import hamburgerMenu from '@iconify-icons/mdi/hamburger-menu'
import login from '@iconify-icons/mdi/login'
import menuDown from '@iconify-icons/mdi/menu-down'
import user from '@iconify-icons/mdi/user'
import closeIcon from '@iconify-icons/mdi/close'
import copy from '@iconify-icons/mdi/content-copy'

export const HamburgerMenu = (props) => <InlineIcon icon={hamburgerMenu} {...props} />
export const LoginIcon = (props) => <InlineIcon icon={login} {...props} />
export const IconUser = (props) => <InlineIcon icon={user} {...props} />
export const IconDown = (props) => <InlineIcon icon={menuDown} {...props} />
export const IconClose = (props) => <InlineIcon icon={closeIcon} {...props} />
export const IconCopy = (props) => <InlineIcon icon={copy} {...props} />
