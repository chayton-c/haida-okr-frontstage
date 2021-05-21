import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";

export class UploadUtil {
  static uploadFile(file: any, url: string, http: HttpClient, next?: (resp: any) => void) {
    let formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', url, formData, options);

    http.request(req).subscribe(
      observer => {
        let resp = observer as any;
        if (!resp || !resp.body) return;
        console.log(resp.body);
        if (next) next(resp);
      }
    )
  }
}
