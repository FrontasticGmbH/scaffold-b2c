export class StringHelpers {
  /**
   * isNumeric tests a string and returns true when it's a decimal value
   */
  static isNumeric = (val: string) => !isNaN(+val);

  /**
   * capitaliseFirstLetter capitalises only the very first character of a string, leaving the
   * rest unedited
   */
  static capitalise = (val: string) => val.charAt(0).toUpperCase() + val.slice(1);
}
