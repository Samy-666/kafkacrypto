import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../models/login.model';
import { LOGIN_ROUTE, REGISTER_ROUTE, USER_INFO_ROUTE } from '../config/app.config';

@Injectable({
    providedIn: 'root',
})
export class AuthentificationService {
    constructor(private http: HttpClient) { }
    private loggedIn = false;

    login(email: string, password: string): Observable<boolean> {
        const body = { "email": email, "password": password };
        return this.http.post<any>(`${environment.apiUrl}` + LOGIN_ROUTE, body)
            .pipe(
                map(response => {
                    if (response && response.token) {
                        localStorage.setItem('token', JSON.stringify(response.token));
                        this.loggedIn = true;
                    }
                    return this.loggedIn;
                })
            );
    }

    register(params: RegisterModel): Observable<boolean> {
        const body = params;

        return this.http.post<any>(`${environment.apiUrl}`+ REGISTER_ROUTE, body)
            .pipe(
                map(response => {
                    if (response && response.token) {
                        localStorage.setItem('token', JSON.stringify(response.token));
                        this.loggedIn = true;
                    }
                    return this.loggedIn;
                })
            ).pipe(tap(() => this.login(params.email, params.password)));

    }
    getUserInfo(): Observable<RegisterModel> {
        const token = JSON.parse(localStorage.getItem('token')!);
        const HttpHeaders = {
            'Authorization': 'Bearer ' + token
        };
        return this.http.get<RegisterModel>(`${environment.apiUrl}` + USER_INFO_ROUTE, { headers: HttpHeaders }).pipe(
            map(response => {
                return response;
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.loggedIn = false;
    }

    isLoggedIn(): boolean {
        if (localStorage.getItem('token')) {
            this.loggedIn = true;
        }
        return this.loggedIn;
    }
}