import * as pathToRegexp from 'path-to-regexp'

enum Routes {
  Home = '/',
  Register = '/register',
  Bookings = '/bookings',
  Organization = '/organization',
  SignIn = '/sign-in'
}

export const getUrl = (path: Routes, params: object) => {
  const toPath = pathToRegexp.compile(path)
  return toPath(params)
}

export default Routes
