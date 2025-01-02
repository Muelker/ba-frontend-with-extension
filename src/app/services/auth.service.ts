import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccessRefreshToken } from '../interfaces/access_refresh_token';
import { AccessToken } from '../interfaces/access_token'
import { throwError } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(data: any): Observable<AccessRefreshToken> {
    const url = 'auth/jwt/create'
    return this.http.post<AccessRefreshToken>(url, data);
  }

  register(data: any) {
    //const url = 'auth/users';
    const url = 'auth/users/';
    return this.http.post(url, data);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('accessToken') != null;
  }

  refreshToken(): Observable<AccessToken>  {
    const url = 'auth/jwt/refresh'
    const refreshToken = sessionStorage.getItem('refreshToken');
    console.log(refreshToken);
    if (refreshToken) {
      return this.http.post<AccessToken>(url, { refresh: refreshToken });
    }
    return throwError('No refresh token available');
  }
}
