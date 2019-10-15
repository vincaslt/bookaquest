/*
 *  To add new locale:
 -  Add locale here (i18next) 
 -  Add locale to i18next-parser.config.js (parser)
 -  Add locale mapping to date locale in commons/i81n.ts
 */
export default {
  locales: ['en', 'lt'],
  backendUrl: 'http://localhost:3001',
  env: {
    prod: process.env.NODE_ENV === 'production',
    dev: process.env.NODE_ENV !== 'production'
  }
}
