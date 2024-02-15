import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/authentification/service/token-storage.service';
import {
  GET_FAVORIS,
  ADD_FAVORIS,
  DELETE_FAVORIS,
} from 'src/app/config/app.config';
import {  CryptoToAdd, Favorite } from 'src/app/models/favorite.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getFavoris() {
    const token = this.tokenService.getToken();
    const headers = this.createHeaders(token);
    return this.http.get<Favorite>(`${environment.apiUrl}${GET_FAVORIS}`, {
      headers,
    });
  }

  public addToFavoris(favoris: CryptoToAdd) {
    const token = this.tokenService.getToken();
    const headers = this.createHeaders(token);
    return this.http.post<CryptoToAdd>(
      `${environment.apiUrl}${ADD_FAVORIS}`,
        favoris,
      { headers }
    );
  }

  public deleteFromFavoris(favoris: CryptoToAdd) {
    const token = this.tokenService.getToken();
    const headers = this.createHeaders(token);
    return this.http.post<any>(
      `${environment.apiUrl}${DELETE_FAVORIS}`,
      favoris,
      { headers }
    );
  }

  private createHeaders(token: string | null): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
