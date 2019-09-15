export default {
  locales: ['en', 'lt'],
  backendUrl: 'http://localhost:3001',
  env: {
    prod: process.env.NODE_ENV === 'production',
    dev: process.env.NODE_ENV !== 'production'
  }
}
