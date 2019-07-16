import * as pathToRegexp from 'path-to-regexp'

enum Routes {
  Home = '/',
  Register = '/register',
  FormBuilder = '/build',
  Bookings = '/bookings',
  SignIn = '/sign-in'
}

export const getUrl = (path: Routes, params: object) => {
  const toPath = pathToRegexp.compile(path)
  return toPath(params)
}

export default Routes
