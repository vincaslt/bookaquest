module.exports = {
  default: [
    {
      functions: ['t', 'tt'],
      lexer: ['TypescriptLexer'],
      tsOptions: {
        jsx: 'Preserve',
        target: 'esnext'
      }
    }
  ],
  input: ['../commons/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
  keySeparator: false,
  locales: ['en', 'lt'],
  namespaceSeparator: false,
  output: 'web-client/public/locales/$LOCALE/$NAMESPACE.json',
  useKeysAsDefaultValue: true,
  verbose: true
}
