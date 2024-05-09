import stringToColor from 'string-to-color';
import { colors } from './colors';

export const textToColor = (text: string) => {
  const cleanedText = text.toLowerCase().replace(/[ -_]/g, '');
  const color: string | undefined = colors[cleanedText];
  return color ?? stringToColor(text);
};
