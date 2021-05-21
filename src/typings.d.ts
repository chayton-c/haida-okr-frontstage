// # 3rd Party Library
// If the library doesn't have typings available at `@types/`,
// you can still use it by manually adding typings for it
import * as L from 'leaflet';
declare module 'leaflet' {
  namespace control {
    // tslint:disable-next-line:typedef
    function ruler(v: any);
  }
}
