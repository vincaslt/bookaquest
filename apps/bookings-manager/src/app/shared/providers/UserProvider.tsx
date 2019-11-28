import * as React from 'react';
import { getAuthUserInfo } from '../../api/application';
import { UserInfo, UserMembership } from '../../interfaces/user';
import { OrganizationInvitation } from '../../interfaces/organizationMember';

export interface UserProviderState {
  isLoading: boolean;
  userInfo?: UserInfo;
  memberships?: UserMembership[];
  invitations?: OrganizationInvitation[];
  setUserInfo: (userInfo: UserInfo) => void;
  setMemberships: (memberships: UserMembership[]) => void;
  setInvitations: (invitations: OrganizationInvitation[]) => void;
}

export const UserContext = React.createContext<UserProviderState | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [memberships, setMemberships] = React.useState<UserMembership[]>();
  const [invitations, setInvitations] = React.useState<
    OrganizationInvitation[]
  >();
  const [userInfo, setUserInfo] = React.useState<UserInfo>();

  // TODO: refreshing token actually logs out... fixit
  React.useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!userInfo && accessToken && refreshToken) {
      setIsLoading(true);
      getAuthUserInfo()
        .then(data => {
          setMemberships(data.memberships);
          setInvitations(data.invitations);
          setUserInfo(data.user);
        })
        .finally(() => setIsLoading(false));
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        memberships,
        invitations,
        setUserInfo,
        setMemberships,
        setInvitations,
        isLoading
      }}
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
