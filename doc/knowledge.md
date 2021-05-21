
# 1. leaflet plugs 引入 Angular方法

  1）拷贝控件js相关文件到 assets/ 目录下
  2）修改angular.json增加stylesheet 和 js 脚本

```
"styles": [
  "src/styles.less",
  "node_modules/mapbox-gl/dist/mapbox-gl.css",
  "node_modules/leaflet/dist/leaflet.css",
  "src/assets/leaflet-ruler/leaflet-ruler.css"
],
"scripts": [
  "src/assets/leaflet-ruler/leaflet-ruler.js"
],
```

​	3）修改typings.d.ts 文件	

```
import * as L from 'leaflet';
declare module 'leaflet'{
  namespace control{
    // tslint:disable-next-line:typedef
    function ruler(v: any);
  }
}
```

  4）正常使用

```
    // 测量控件
    const ruleroptions = {
      position: 'topright',         // Leaflet control position option
      circleMarker: {               // Leaflet circle marker options for points used in this plugin
        color: 'red',
        radius: 2
      },
      lineStyle: {                  // Leaflet polyline options for lines used in this plugin
        color: '#32CD32',
        dashArray: '1,6'
      },
      lengthUnit: {                 // You can use custom length units. Default unit is kilometers.
        display: 'm',              // This is the display value will be shown on the screen. Example: 'meters'
        decimal: 2,                 // Distance result will be fixed to this value.
        factor: 1000,               // This value will be used to convert from kilometers. Example: 1000 (from kilometers to meters)
        label: '距离:'
      },
      angleUnit: {
        display: '&deg;',           // This is the display value will be shown on the screen. Example: 'Gradian'
        decimal: 2,                 // Bearing result will be fixed to this value.
        factor: null,                // This option is required to customize angle unit. Specify solid angle value for angle unit. Example: 400 (for gradian).
        label: '方位:'
      }
    };
// 增加距离测量
    L.control.ruler(ruleroptions).addTo(this.map);
```