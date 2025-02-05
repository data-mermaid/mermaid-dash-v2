import { useAuth0 } from '@auth0/auth0-react'
import { ButtonSecondary } from '../../generic'
import { PrivateChartWrapper } from './Charts.styles'

export const PrivateChartView = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect({ appState: { returnTo: location.search } })
  }

  return (
    <PrivateChartWrapper>
      <strong>This method has been set to private</strong>
      {!isAuthenticated && (
        <ButtonSecondary onClick={handleLogin}>Log in to view data</ButtonSecondary>
      )}
    </PrivateChartWrapper>
  )
}
