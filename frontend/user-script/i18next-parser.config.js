module.exports = {
  input: ['../commons/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
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
  output: 'user-script/public/locales/$LOCALE/$NAMESPACE.json',
  reactNamespace: true,
  useKeysAsDefaultValue: true,
  verbose: true
}
