/* eslint-disable @typescript-eslint/no-var-requires */
const { presetPalettes } = require('@ant-design/colors');

const colors = Object.keys(presetPalettes).reduce((colorsMap, color) => {
  const shadesArray = presetPalettes[color];
  const shadesMap = shadesArray.reduce(
    (map, shade, i) => ({ ...map, [`${i}00`]: shade }),
    {}
  );
  return {
    ...colorsMap,
    [color]: shadesMap
  };
}, {});

module.exports = {
  plugins: [],
  theme: {
    extend: {
      colors
    }
  }

  // variants: ['first', 'last', 'odd', 'even'],
};
