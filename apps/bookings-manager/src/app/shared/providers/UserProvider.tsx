import * as React from 'react';
import { getAuthUserInfo } from '../../api/application';
import { UserInfo, UserMembership } from '../../interfaces/user';

export interface UserProviderState {
  isLoading: boolean;
  userInfo: UserInfo | null;
  memberships: UserMembership[] | null;
  setUserInfo: (userInfo: UserInfo) => void;
  setMemberships: (userInfo: UserMembership[]) => void;
}

export const UserContext = React.createContext<UserProviderState | null>(null);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [memberships, setMemberships] = React.useState<UserMembership[] | null>(
    null
  );
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);

  // TODO: refreshing token actually logs out... fixit
  React.useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!userInfo && accessToken && refreshToken) {
      setIsLoading(true);
      getAuthUserInfo()
        .then(data => {
          setMemberships(data.memberships);
          setUserInfo(data.user);
        })
        .finally(() => setIsLoading(false));
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{ userInfo, memberships, setUserInfo, setMemberships, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function withUserProvider<P>(Component: React.ComponentType<P>) {
  return (props: P) => (
    <UserProvider>
      <Component {...props} />
    </UserProvider>
  );
}
