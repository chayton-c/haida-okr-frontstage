export class StringUtils {


  static arrayEmpty(a: any[] | undefined): boolean {
    return !a || a.length <= 0;
  }

  static arrayNotEmpty(a: any[] | undefined): boolean {
    return !this.arrayEmpty(a);
  }


}
