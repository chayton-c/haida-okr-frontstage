export class DateUtils {
  public static getTodayTime000000(): Date {
    let current = new Date();
    current.setHours(0, 0, 0, 0);
    return new Date(current);
  }

  public static getTodayTime235959(): Date {
    let current = new Date();
    current.setHours(23, 59, 59, 0);
    return new Date(current);
  }

  public static getNowYear(): Date {
    let current = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0);
    return new Date(current);
  }

  public static getNowMonth(): Date {
    let current = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
    return new Date(current);
  }

  public static getLastMonth(): Date {
    let current = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0);
    return new Date(current);
  }

  public static getMillisecondsByDays(days: number): number {
    // 86400000 = 24 * 60 * 60 * 1000
    return days * 86400000;
  }
}
