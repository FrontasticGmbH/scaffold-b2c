export const mapLocaleToMeaningfulFormat = (locale: string) => {
  switch (locale) {
    case 'de':
      return { name: 'German' };
    default:
      return { name: 'English' };
  }
};
