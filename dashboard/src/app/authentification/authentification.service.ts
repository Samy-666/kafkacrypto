import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../models/login.model';
import {
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  USER_INFO_ROUTE,
} from '../config/app.config';
import { TokenService } from './service/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private loggedIn: boolean = false;
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string): Observable<boolean> {
    const body = { email: email, password: password };
    return this.http
      .post<any>(`${environment.apiUrl}` + LOGIN_ROUTE, body)
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.tokenService.setToken(response.token);
            this.loggedIn = true;
          }
          return this.loggedIn;
        })
      );
  }

  register(params: RegisterModel): Observable<boolean> {
    const body = params;

    return this.http
      .post<any>(`${environment.apiUrl}` + REGISTER_ROUTE, body)
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.tokenService.setToken(response.token);
            this.loggedIn = true;
          }
          return this.loggedIn;
        })
      )
      .pipe(tap(() => this.login(params.email, params.password)));
  }
  getUserInfo(): Observable<RegisterModel> {
    const token = this.tokenService.getToken();
    const HttpHeaders = {
      Authorization: 'Bearer ' + token,
    };
    return this.http
      .get<RegisterModel>(`${environment.apiUrl}` + USER_INFO_ROUTE, {
        headers: HttpHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn || this.tokenService.getToken() !== null;
  }
}
