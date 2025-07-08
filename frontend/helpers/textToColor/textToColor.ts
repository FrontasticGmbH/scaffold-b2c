import { colors } from './colors';

export const textToColor = (text: string) => {
  if (!text) return { label: '', code: '' };

  // Missing text for current active language.. so use any fallback language in that case
  if (typeof text !== 'string') text = (Object.values(text)[0] as string) ?? '';

  const cleanedText = text?.toLowerCase().replace(/[ -_]/g, '');

  if (text?.includes(':')) {
    const [label, code] = text.split(':');
    return { label, code: code.toLowerCase() };
  } else if (colors[cleanedText]) {
    const color = colors[cleanedText];
    return { label: text, code: color };
  } else return { label: text, code: text };
};
