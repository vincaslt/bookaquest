import * as pathToRegexp from 'path-to-regexp'

export enum PrivateRoutes {
  Dashboard = '/',
  Bookings = '/bookings',
  Organization = '/organization',
  EscapeRooms = '/escape-rooms'
}

export enum PublicRoutes {
  SignIn = '/',
  Register = '/register'
}

export const getUrl = (path: PublicRoutes | PrivateRoutes, params: object) => {
  const toPath = pathToRegexp.compile(path)
  return toPath(params)
}
