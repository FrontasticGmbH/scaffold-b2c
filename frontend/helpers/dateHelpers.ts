export class DateHelpers {
  /**
   * formatTime takes a date and returns a fomatted string, for example 12:34PM
   */
  static formatTime = (date: Date) => {
    let hours = date.getHours();
    const meridiemString = hours > 11 ? 'PM' : 'AM';
    if (meridiemString === 'PM' && hours !== 12) {
      hours -= 12;
    }
    return `${hours}:${date.getMinutes()}${meridiemString}`;
  };

  private static formatDayOrMonth = (num: number) => {
    if (num < 10) {
      return '0' + num.toString();
    }
    return num.toString();
  };

  /**
   * formatMonth takes a number representing the month and returns a two digit string, for example 9 => "09"
   */
  static formatMonth = (month: number) => DateHelpers.formatDayOrMonth(month);

  /**
   * formatDay takes a number representing the day and returns a two digit string, for example 9 => "09"
   */
  static formatDay = (day: number) => DateHelpers.formatDayOrMonth(day);

  /**
   * formatDate takes a Date or string representing the date and returns a user-friendly string, for example
   * Mon Mar 28 2022 07:27:13 GMT+0100 (British Summer Time) => 28/03, 07:27AM
   */
  static formatDate = (date: Date | string) => {
    let unformattedDate: Date = date as Date;
    if (typeof date === 'string') {
      unformattedDate = new Date(date);
    }
    return `${DateHelpers.formatDay(unformattedDate.getDay())}/${DateHelpers.formatMonth(
      unformattedDate.getMonth(),
    )}, ${DateHelpers.formatTime(unformattedDate)}`;
  };
}
