import { colors } from './colors';

export const textToColor = (text: string) => {
  const cleanedText = text?.toLowerCase().replace(/[ -_]/g, '');

  if (text?.includes(':')) {
    const [label, code] = text.split(':');
    return { label, code: code.toLowerCase() };
  } else if (colors[cleanedText]) {
    const color = colors[cleanedText];
    return { label: text, code: color };
  } else return { label: text, code: text };
};
