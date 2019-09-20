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
  input: ['src/**/*.{ts,tsx}'],
  keySeparator: false,
  locales: ['en', 'lt'],
  namespaceSeparator: false,
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  useKeysAsDefaultValue: true,
  verbose: true
}
