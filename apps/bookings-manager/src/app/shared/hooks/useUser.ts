import * as React from 'react';
import * as api from '../../api/application';
import { PublicRoutes } from '../../constants/routes';
import { SignIn } from '../../interfaces/auth';
import { UserContext, UserProviderState } from '../providers/UserProvider';

export function useUser() {
  const userState = React.useContext(UserContext) as UserProviderState;

  const logout = () => {
    api.signOut();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // eslint-disable-next-line no-restricted-globals
    location.assign(PublicRoutes.SignIn);
  };

  const login = (credentials: SignIn) =>
    api
      .signIn(credentials)
      .then(({ tokens: { accessToken, refreshToken }, user, memberships }) => {
        userState.setUserInfo(user);
        userState.setMemberships(memberships);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      });

  return { ...userState, logout, login };
}
