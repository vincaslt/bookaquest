module.exports = {
  input: [
    '../libs/components/**/*.{ts,tsx}',
    '../libs/utilities/**/*.{ts,tsx}',
    'src/**/*.{ts,tsx}'
  ],
  keySeparator: false,
  lexers: {
    ts: [
      {
        functions: ['t', 'tt'],
        lexer: ['JavascriptLexer']
      }
    ],
    tsx: [
      {
        functions: ['t', 'tt'],
        lexer: ['JsxLexer']
      }
    ]
  },
  locales: ['en', 'lt'],
  namespaceSeparator: false,
  output: 'apps/bookings-app/src/assets/locales/$LOCALE/$NAMESPACE.json',
  reactNamespace: true,
  useKeysAsDefaultValue: true,
  verbose: true
};
