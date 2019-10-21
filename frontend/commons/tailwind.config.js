
// tslint:disable:object-literal-sort-keys
const { presetPalettes } = require('@ant-design/colors')
const { keys } = require('ramda')

const colors = keys(presetPalettes).reduce((colorsMap, color) => {
  const shadesArray = presetPalettes[color]
  const name = color === 'grey' ? 'grey' : color
  const shadesMap = shadesArray.reduce((map, shade, i) => ({ ...map, [`${i}00`]: shade }), {})
  return {
    ...colorsMap,
    [name]: shadesMap
  }
}, {})

module.exports = {
  plugins: [],
  theme: {
    extend: {
      colors,
    }
  }

  // variants: ['first', 'last', 'odd', 'even'],
}
