export class HttpUtils {
  public static transform(value: any): any {
    let params: any = {};
    for (let key in value) {
      if (value[key] != undefined && value[key] != null && !Array.isArray(value[key])) {
        params[key] = value[key];
      }
    }
    return params;
  }
}
