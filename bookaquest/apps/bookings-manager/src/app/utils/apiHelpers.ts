import Axios, { AxiosError } from 'axios';
import { PublicRoutes } from '../constants/routes';
import { JwtPayload } from '../interfaces/auth';
import { config } from '@bookaquest/utilities';
import {
  RequestRefreshTokenDTO,
  RefreshTokenDTO
} from '@bookaquest/interfaces';

export const api = Axios.create({
  baseURL: config.backendUrl
});

const refreshAuthToken = (dto: RequestRefreshTokenDTO) =>
  api.post<RefreshTokenDTO>('/refreshToken', dto).then(res => res.data);

function parseAccessToken(accessToken: string): JwtPayload {
  const base64Url = accessToken.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}

function createAuthHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

// TODO: this seems like it might not be refreshing expired tokens but instead logging out
export function withAuth<Args extends any[], T>(
  request: (headers: { Authorization: string }) => (...args: Args) => Promise<T>
) {
  return (...args: Args): Promise<T> => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      // Not logged in - redirect to login
      // eslint-disable-next-line no-restricted-globals
      location.assign(PublicRoutes.SignIn);
      return Promise.reject(new Error('Not logged in!'));
    }

    return request(createAuthHeaders(accessToken))(...args).catch(
      (e: AxiosError) => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!e.response || e.response.status !== 401) {
          return Promise.reject(e);
        }

        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          return Promise.reject(new Error('Token has expired!'));
        }

        // Try to get a new access token
        const { userId } = parseAccessToken(accessToken);
        return refreshAuthToken({ refreshToken, userId })
          .then(({ token }) => {
            localStorage.setItem('accessToken', token);
            return request(createAuthHeaders(token))(...args);
          })
          .catch(_ => {
            // Failed to refresh token, session has expired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // eslint-disable-next-line no-restricted-globals
            location.assign(PublicRoutes.SignIn);
            return Promise.reject('Token has expired!');
          });
      }
    );
  };
}
