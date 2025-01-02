import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

//Interceptor to add authorization to http requests (Accestoken)
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log(environment.apiUrl);
    
    const accessToken = sessionStorage.getItem('accessToken');
    const authService = inject(AuthService);

    let apiReq = request.clone();
    if (!request.url.startsWith('http')) {
      apiReq = request.clone({ url: `${environment.apiUrl}/${request.url}`, reportProgress: true });
      // console.log(apiReq);
    }

    if (accessToken && authService.isLoggedIn()) {
      apiReq = apiReq.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        },
        //headers: apiReq.headers.append("Access-Control-Allow-Headers", "cache-control,content-type,hash-referer,x-requested-with, x-xsrf-token"),
      });
      // console.log(apiReq);
    }
    console.log(apiReq);
    return next.handle(apiReq);
  }
}