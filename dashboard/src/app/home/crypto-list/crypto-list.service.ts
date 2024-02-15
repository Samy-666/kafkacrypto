import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CryptoList, ResponseValue, ResponseMarketCap } from 'src/app/models/crypto.model';
import { TokenService } from 'src/app/authentification/service/token-storage.service';
import { CRYPTO_INFO, CRYPTO_LISTING_CRYPTO, CRYPTO_LIST_ROUTE, CRYPTO_MARKET_CAP, CRYPTO_VALUE } from 'src/app/config/app.config';

@Injectable({
    providedIn: 'root',
})
export class CryptoListService {
    constructor(private http: HttpClient, private tokenService: TokenService) { }

    public getCryptoList() {
        const token = this.tokenService.getToken();
        const headers = this.createHeaders(token);
        return this.http.get<CryptoList[]>(`${environment.apiUrl}${CRYPTO_LIST_ROUTE}`, { headers });
    }

    public getListingCrypto() {
        const token = this.tokenService.getToken();
        const headers = this.createHeaders(token);
        return this.http.post<CryptoList[]>(`${environment.apiUrl}${CRYPTO_LISTING_CRYPTO}`, {}, { headers });
    }

    public getCryptoInfo(id: string) {
        const token = this.tokenService.getToken();
        const headers = this.createHeaders(token);
        return this.http.get<CryptoList>(`${environment.apiUrl}${CRYPTO_INFO}/${id}`, { headers });
    }

    public getDataValueByTime(id:number, periode:string) {
        const token = this.tokenService.getToken();
        const headers = this.createHeaders(token);
        const body = { crypto_id: id, time_interval: periode };
        return this.http.post<ResponseValue[]>(`${environment.apiUrl}${CRYPTO_VALUE}`, body, { headers });
    }

    public getDataMCByTime(id:number, periode:string) {
        const token = this.tokenService.getToken();
        const headers = this.createHeaders(token);
        const body = { crypto_id: id, time_interval: periode };
        return this.http.post<ResponseMarketCap[]>(`${environment.apiUrl}${CRYPTO_MARKET_CAP}`, body, { headers });
    }

    private createHeaders(token: string | null): HttpHeaders {
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }
}
