import stringToColor from 'string-to-color';
import { colors } from './colors';

export const textToColor = (text: string) => {
  if (text.includes(':')) {
    const [label, code] = text.split(':');
    return { label, code: code.toLowerCase() };
  } else {
    const cleanedText = text.toLowerCase().replace(/[ -_]/g, '');
    const color: string | undefined = colors[cleanedText];
    return { label: text, code: color ?? stringToColor(text) };
  }
};
