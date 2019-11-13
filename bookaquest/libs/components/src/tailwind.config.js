import { presetPalettes } from '@ant-design/colors';
import { keys } from 'ramda';

const colors = keys(presetPalettes).reduce((colorsMap, color) => {
  const shadesArray = presetPalettes[color];
  const name = color === 'grey' ? 'grey' : color;
  const shadesMap = shadesArray.reduce(
    (map, shade, i) => ({ ...map, [`${i}00`]: shade }),
    {}
  );
  return {
    ...colorsMap,
    [name]: shadesMap
  };
}, {});

export const plugins = [];
export const theme = {
  extend: {
    colors
  }
};
