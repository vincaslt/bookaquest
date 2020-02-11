import * as pathToRegexp from 'path-to-regexp';

export enum PrivateRoutes {
  Bookings = '/',
  Booking = '/booking/:bookingId',
  Organization = '/organization',
  EscapeRooms = '/escape-rooms',
  EscapeRoom = '/escape-rooms/:escapeRoomId'
}

export enum PublicRoutes {
  SignIn = '/',
  Register = '/register'
}

export const getUrl = (path: PublicRoutes | PrivateRoutes, params: object) => {
  const toPath = pathToRegexp.compile(path);
  return toPath(params);
};
