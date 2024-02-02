import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRYPTO_INFO, CRYPTO_LIST_ROUTE, CRYPTO_MARKET_CAP, CRYPTO_VALUE } from 'src/app/config/app.config';
import { environment } from 'src/environments/environment';
import { CryptoInfoModel, Values, MarketCap } from 'src/app/models/crypto.model';


@Injectable({
    providedIn: 'root',
})
export class CryptoListService {
    constructor(private http: HttpClient) { }


    public getCryptoList() {
        const token = JSON.parse(localStorage.getItem('token')!);
        const HttpHeaders = {
            'Authorization': 'Bearer ' + token
        };
        return this.http.get<CryptoInfoModel[]>(`${environment.apiUrl}` + CRYPTO_LIST_ROUTE, { headers: HttpHeaders });
    }

    public getCryptoInfo(id: string) {
        const token = JSON.parse(localStorage.getItem('token')!);
        const HttpHeaders = {
            'Authorization': 'Bearer ' + token
        };
        return this.http.get<CryptoInfoModel>(`${environment.apiUrl}` + CRYPTO_INFO + '/' + id, { headers: HttpHeaders });
    }

    public getDataValueByTime(id:number, periode:string) {
       const token = JSON.parse(localStorage.getItem('token')!);
        const HttpHeaders = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
        const body = {
            crypto_id: id,
            time_interval: periode
        }
        return this.http.post<Values[]>(`${environment.apiUrl}` + CRYPTO_VALUE, body, { headers: HttpHeaders });
    }

    public getDataMCByTime(id:number, periode:string) {
        const token = JSON.parse(localStorage.getItem('token')!);
        const HttpHeaders = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
        const body = {
            crypto_id: id,
            time_interval: periode
        }
        return this.http.post<MarketCap[]>(`${environment.apiUrl}` + CRYPTO_MARKET_CAP, body, { headers: HttpHeaders });
    }
}