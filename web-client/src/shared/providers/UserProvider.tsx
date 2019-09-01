import * as React from 'react'
import { getAuthUserInfo } from '../../api/application'
import { UserInfo } from '../../interfaces/user'

export interface UserProviderState {
  isLoading: boolean
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo) => void
}

export const UserContext = React.createContext<UserProviderState | null>(null)

interface Props {
  children: React.ReactNode
}

export const UserProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null)

  React.useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (!userInfo && accessToken && refreshToken) {
      setIsLoading(true)
      getAuthUserInfo()
        .then(setUserInfo)
        .finally(() => setIsLoading(false))
    }
  }, [])

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function withUserProvider<P>(Component: React.ComponentType<P>) {
  return (props: P) => (
    <UserProvider>
      <Component {...props} />
    </UserProvider>
  )
}
